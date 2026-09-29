import http from 'node:http';
import { checkPin, makeUser, newSession, profiles as defaultProfiles, publicUser, readStore, writeStore } from './auth-store.mjs';

const port = Number(process.env.PORT || 3001);
const appPages = defaultProfiles['Administrador Geral'].pages;
const json = (res, status, body, headers = {}) => res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...headers }).end(JSON.stringify(body));
const cookies = (req) => Object.fromEntries((req.headers.cookie || '').split(';').map((part) => part.trim().split('=')).filter(([key]) => key));
const body = async (req) => new Promise((resolve, reject) => { let raw = ''; req.on('data', (part) => { raw += part; if (raw.length > 1e6) reject(new Error('Payload inválido.')); }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('JSON inválido.')); } }); });
const sessionUser = async (req) => {
  const token = cookies(req).cb_session;
  if (!token) return null;
  const store = await readStore();
  const session = store.sessions.find((item) => item.token === token && item.expiresAt > Date.now());
  return session ? { store, user: store.users.find((item) => item.id === session.userId) } : null;
};
const requireAdmin = async (req, res) => {
  const current = await sessionUser(req);
  if (!current?.user || current.user.status !== 'Ativo' || current.user.role !== 'Administrador Geral') { json(res, 403, { error: 'Acesso restrito ao Administrador Geral.' }); return null; }
  return current;
};

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/health') return json(res, 200, { ok: true });
    if (req.method === 'POST' && url.pathname === '/auth/login') {
      const { username, pin } = await body(req); const store = await readStore();
      const user = store.users.find((item) => item.username === String(username || '').trim().toLowerCase());
      if (!user || user.status !== 'Ativo') return json(res, 401, { error: 'Usuário, PIN ou situação inválidos.' });
      if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) return json(res, 429, { error: 'Acesso bloqueado temporariamente. Tente novamente em 15 minutos.' });
      if (!checkPin(user, pin)) { user.failedAttempts = (user.failedAttempts || 0) + 1; if (user.failedAttempts >= 5) { user.failedAttempts = 0; user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); } await writeStore(store); return json(res, 401, { error: 'Usuário, PIN ou situação inválidos.' }); }
      user.failedAttempts = 0; user.lockedUntil = null; store.sessions = store.sessions.filter((item) => item.expiresAt > Date.now()); const session = newSession(user.id); store.sessions.push(session); await writeStore(store);
      return json(res, 200, { user: publicUser(user) }, { 'set-cookie': `cb_session=${session.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800` });
    }
    if (req.method === 'POST' && url.pathname === '/auth/logout') return json(res, 200, { ok: true }, { 'set-cookie': 'cb_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
    if (req.method === 'GET' && url.pathname === '/auth/me') { const current = await sessionUser(req); return current?.user ? json(res, 200, { user: publicUser(current.user), profiles: current.store.profiles || defaultProfiles }) : json(res, 401, { error: 'Sessão não encontrada.' }); }
    if (req.method === 'GET' && url.pathname === '/profiles') { const current = await sessionUser(req); return current?.user ? json(res, 200, { profiles: current.store.profiles || defaultProfiles }) : json(res, 401, { error: 'Sessão não encontrada.' }); }
    if (req.method === 'POST' && url.pathname === '/profiles') {
      const current = await requireAdmin(req, res); if (!current) return;
      const input = await body(req); const name = String(input.name || '').trim();
      if (!name || current.store.profiles[name]) return json(res, 409, { error: 'Informe um nome de nível que ainda não exista.' });
      const pages = [...new Set((input.pages || []).filter((page) => appPages.includes(page)))];
      if (!pages.length) return json(res, 400, { error: 'Selecione ao menos uma tela para o nível de acesso.' });
      current.store.profiles[name] = { label: name, pages, status: input.status === 'Inativo' ? 'Inativo' : 'Ativo', system: false };
      await writeStore(current.store); return json(res, 201, { profiles: current.store.profiles });
    }
    const profileMatch = url.pathname.match(/^\/profiles\/([^/]+)$/);
    if (req.method === 'PATCH' && profileMatch) {
      const current = await requireAdmin(req, res); if (!current) return;
      const name = decodeURIComponent(profileMatch[1]); const profile = current.store.profiles[name];
      if (!profile) return json(res, 404, { error: 'Nível de acesso não encontrado.' });
      const input = await body(req); const pages = [...new Set((input.pages || []).filter((page) => appPages.includes(page)))];
      if (name === 'Administrador Geral') { profile.pages = appPages; profile.status = 'Ativo'; }
      else { if (!pages.length) return json(res, 400, { error: 'Selecione ao menos uma tela para o nível de acesso.' }); profile.pages = pages; profile.status = input.status === 'Inativo' ? 'Inativo' : 'Ativo'; }
      await writeStore(current.store); return json(res, 200, { profiles: current.store.profiles });
    }
    if (req.method === 'GET' && url.pathname === '/users') { const current = await requireAdmin(req, res); if (!current) return; return json(res, 200, { users: current.store.users.map(publicUser) }); }
    if (req.method === 'POST' && url.pathname === '/users') { const current = await requireAdmin(req, res); if (!current) return; const input = await body(req); if (current.store.users.some((item) => item.username === String(input.username || '').trim().toLowerCase())) return json(res, 409, { error: 'Esse nome de usuário já existe.' }); const user = makeUser(input); current.store.users.push(user); await writeStore(current.store); return json(res, 201, { user: publicUser(user) }); }
    const userMatch = url.pathname.match(/^\/users\/([^/]+)$/);
    if (req.method === 'PATCH' && userMatch) { const current = await requireAdmin(req, res); if (!current) return; const input = await body(req); const user = current.store.users.find((item) => item.id === userMatch[1]); if (!user) return json(res, 404, { error: 'Usuário não encontrado.' }); Object.assign(user, { name: input.name?.trim() || user.name, email: input.email?.trim().toLowerCase() || user.email, role: input.role || user.role, status: input.status || user.status }); if (input.pin) { const replacement = makeUser({ ...user, pin: input.pin }); user.salt = replacement.salt; user.pinHash = replacement.pinHash; } await writeStore(current.store); return json(res, 200, { user: publicUser(user) }); }
    return json(res, 404, { error: 'Rota não encontrada.' });
  } catch (error) { return json(res, 400, { error: error.message || 'Erro inesperado.' }); }
}).listen(port, '0.0.0.0', () => console.log(`Auth API on ${port}`));
