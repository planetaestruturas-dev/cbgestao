import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const profiles = {
  'Administrador Geral': { label: 'Administrador Geral', pages: ['Visão geral', 'Unidades', 'Contratos', 'Cobranças', 'Conciliação', 'Despesas', 'Manutenções', 'Distratos', 'Cadastros', 'Relatórios', 'Backups'], status: 'Ativo', system: true },
  Financeiro: { label: 'Financeiro', pages: ['Visão geral', 'Contratos', 'Cobranças', 'Conciliação', 'Despesas', 'Distratos', 'Relatórios'], status: 'Ativo', system: true },
  Operação: { label: 'Operação', pages: ['Visão geral', 'Unidades', 'Manutenções', 'Relatórios'], status: 'Ativo', system: true },
  Consulta: { label: 'Consulta', pages: ['Visão geral', 'Relatórios'], status: 'Ativo', system: true },
};

const dataFile = process.env.AUTH_DATA_FILE || '/data/auth.json';
const pinHash = (pin, salt) => crypto.scryptSync(pin, salt, 64).toString('hex');
const validPin = (pin) => /^\d{6}$/.test(String(pin));

export async function readStore() {
  try {
    const store = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    store.users ||= [];
    store.sessions ||= [];
    store.profiles ||= structuredClone(profiles);
    return store;
  }
  catch { return { users: [], sessions: [], profiles }; }
}
export async function writeStore(store) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), { mode: 0o600 });
}
export function publicUser(user) {
  const { pinHash: ignored, salt: ignoredSalt, failedAttempts: ignoredAttempts, lockedUntil: ignoredLocked, ...safe } = user;
  return safe;
}
export function makeUser({ name, username, email, role, pin }) {
  if (!name?.trim() || !username?.trim() || !email?.trim() || !validPin(pin)) throw new Error('Preencha nome, usuário, e-mail e um PIN numérico de 6 dígitos.');
  const salt = crypto.randomBytes(16).toString('hex');
  return { id: crypto.randomUUID(), name: name.trim(), username: username.trim().toLowerCase(), email: email.trim().toLowerCase(), role, status: 'Ativo', salt, pinHash: pinHash(pin, salt), failedAttempts: 0, lockedUntil: null, createdAt: new Date().toISOString() };
}
export function checkPin(user, pin) { return validPin(pin) && crypto.timingSafeEqual(Buffer.from(user.pinHash, 'hex'), Buffer.from(pinHash(pin, user.salt), 'hex')); }
export function newSession(userId) { return { token: crypto.randomBytes(32).toString('hex'), userId, expiresAt: Date.now() + 1000 * 60 * 60 * 8 }; }
