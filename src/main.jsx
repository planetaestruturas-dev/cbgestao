import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './mobile.css';
import './components.css';
import './functional.css';
import './responsive.css';
import { parseStatementCsv } from './statementParser.js';

const initialUnits = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `Kitnet ${String(index + 1).padStart(2, '0')}`,
  status: [4, 5].includes(index + 1) ? 'Vaga' : 'Ocupada',
  tenant: ['MARCELO QUEIROZ ALVES', 'MARCELO QUEIROZ ALVES', 'DIRLANE QUEIROZ ALVES', '—', '—', 'DANIELE FERREIRA MARCELINO DE LIMA', 'MARINEUDA FERREIRA MARCELINO DE LIMA', 'MARILAC FERREIRA MARCELINO DE LIMA', 'WANDERSON BARBOSA', 'SUELIANA FERREIRA MARCELINO DE LIMA', 'LUCILENE OLIVEIRA CAMPOS', 'MARIA TERESA MARCELINO DE LIMA'][index],
  rent: [450, 450, 450, 0, 0, 500, 450, 450, 450, 450, 500, 450][index],
}));

const initialCharges = [
  { id: 1, unit: 'Kitnet 01', tenant: 'MARCELO QUEIROZ ALVES', due: '10/03/2025', amount: 450, status: 'Pago', paidAt: '22/03/2025' },
  { id: 2, unit: 'Kitnet 02', tenant: 'MARCELO QUEIROZ ALVES', due: '10/03/2025', amount: 450, status: 'Pago', paidAt: '22/03/2025' },
  { id: 3, unit: 'Kitnet 03', tenant: 'DIRLANE QUEIROZ ALVES', due: '10/03/2025', amount: 450, status: 'Pago', paidAt: '22/03/2025' },
  { id: 4, unit: 'Kitnet 06', tenant: 'DANIELE FERREIRA MARCELINO DE LIMA', due: '13/04/2025', amount: 500, status: 'Pago', paidAt: '28/04/2025' },
  { id: 5, unit: 'Kitnet 07', tenant: 'MARINEUDA FERREIRA MARCELINO DE LIMA', due: '30/03/2025', amount: 450, status: 'Em aberto', paidAt: null },
  { id: 6, unit: 'Kitnet 08', tenant: 'MARILAC FERREIRA MARCELINO DE LIMA', due: '30/03/2025', amount: 450, status: 'Em aberto', paidAt: null },
  { id: 7, unit: 'Kitnet 09', tenant: 'WANDERSON BARBOSA', due: '30/04/2025', amount: 450, status: 'Pago', paidAt: '12/05/2025' },
  { id: 8, unit: 'Kitnet 10', tenant: 'SUELIANA FERREIRA MARCELINO DE LIMA', due: '17/03/2025', amount: 450, status: 'Pago', paidAt: '28/03/2025' },
  { id: 9, unit: 'Kitnet 11', tenant: 'LUCILENE OLIVEIRA CAMPOS', due: '19/04/2025', amount: 500, status: 'Pago', paidAt: '02/05/2025' },
  { id: 10, unit: 'Kitnet 12', tenant: 'MARIA TERESA MARCELINO DE LIMA', due: '15/03/2025', amount: 450, status: 'Pago', paidAt: '28/03/2025' },
  { id: 11, unit: 'Kitnet 01', tenant: 'MARCELO QUEIROZ ALVES', due: '09/04/2025', amount: 450, status: 'Pago', paidAt: '23/04/2025' },
  { id: 12, unit: 'Kitnet 02', tenant: 'MARCELO QUEIROZ ALVES', due: '09/04/2025', amount: 450, status: 'Pago', paidAt: '23/04/2025' },
  { id: 13, unit: 'Kitnet 03', tenant: 'DIRLANE QUEIROZ ALVES', due: '09/04/2025', amount: 450, status: 'Pago', paidAt: '23/04/2025' },
  { id: 14, unit: 'Kitnet 06', tenant: 'DANIELE FERREIRA MARCELINO DE LIMA', due: '13/05/2025', amount: 500, status: 'Em aberto', paidAt: null },
  { id: 15, unit: 'Kitnet 07', tenant: 'MARINEUDA FERREIRA MARCELINO DE LIMA', due: '30/04/2025', amount: 450, status: 'Pago', paidAt: '12/05/2025' },
  { id: 16, unit: 'Kitnet 08', tenant: 'MARILAC FERREIRA MARCELINO DE LIMA', due: '30/04/2025', amount: 450, status: 'Pago', paidAt: '12/05/2025' },
  { id: 17, unit: 'Kitnet 09', tenant: 'WANDERSON BARBOSA', due: '30/05/2025', amount: 450, status: 'Em aberto', paidAt: null },
  { id: 18, unit: 'Kitnet 10', tenant: 'SUELIANA FERREIRA MARCELINO DE LIMA', due: '17/04/2025', amount: 450, status: 'Pago', paidAt: '02/05/2025' },
  { id: 19, unit: 'Kitnet 11', tenant: 'LUCILENE OLIVEIRA CAMPOS', due: '19/05/2025', amount: 500, status: 'Em aberto', paidAt: null },
  { id: 20, unit: 'Kitnet 12', tenant: 'MARIA TERESA MARCELINO DE LIMA', due: '15/04/2025', amount: 450, status: 'Pago', paidAt: '02/05/2025' },
];

const initialContracts = [];

const initialMaintenances = [];

const initialTerminations = [];

const initialTenants = [...new Set(initialUnits.map((unit) => unit.tenant).filter((tenant) => tenant !== '—'))]
  .map((name, index) => ({ id: index + 1, name, cpf: '', phone: '', email: '', status: 'Ativo' }));

const initialBankAccounts = [
  { id: 1, bank: 'Banco Inter', account: '•••• 3528', type: 'Conta corrente', status: 'Ativa' },
];

const initialSuppliers = [];

const initialExpenseCategories = [
  { id: 1, name: 'Manutenção', description: 'Reparos, conservação e melhorias', parentId: '', status: 'Ativa' },
  { id: 2, name: 'Serviços', description: 'Limpeza, mão de obra e serviços recorrentes', parentId: '', status: 'Ativa' },
  { id: 3, name: 'Material', description: 'Materiais de consumo e reparo', parentId: '', status: 'Ativa' },
  { id: 4, name: 'Utilidades', description: 'Água, energia, internet e similares', parentId: '', status: 'Ativa' },
  { id: 5, name: 'Hidráulica', description: 'Encanamento, registros e vazamentos', parentId: 1, status: 'Ativa' },
  { id: 6, name: 'Elétrica', description: 'Iluminação, tomadas e disjuntores', parentId: 1, status: 'Ativa' },
];

const initialExpenses = [];

const bankItems = [];

const appPages = ['Visão geral', 'Unidades', 'Contratos', 'Cobranças', 'Conciliação', 'Despesas', 'Manutenções', 'Distratos', 'Cadastros', 'Relatórios', 'Backups'];
const defaultAccessProfiles = {
  'Administrador Geral': { label: 'Administrador Geral', pages: appPages, status: 'Ativo', system: true },
  Financeiro: { label: 'Financeiro', pages: ['Visão geral', 'Contratos', 'Cobranças', 'Conciliação', 'Despesas', 'Distratos', 'Relatórios'], status: 'Ativo', system: true },
  Operação: { label: 'Operação', pages: ['Visão geral', 'Unidades', 'Manutenções', 'Relatórios'], status: 'Ativo', system: true },
  Consulta: { label: 'Consulta', pages: ['Visão geral', 'Relatórios'], status: 'Ativo', system: true },
};

const referenceData = () => ({
  units: structuredClone(initialUnits),
  charges: structuredClone(initialCharges),
  expenses: structuredClone(initialExpenses),
  bank: structuredClone(bankItems),
  contracts: structuredClone(initialContracts),
  maintenances: structuredClone(initialMaintenances),
  terminations: structuredClone(initialTerminations),
  tenants: structuredClone(initialTenants),
  bankAccounts: structuredClone(initialBankAccounts),
  suppliers: structuredClone(initialSuppliers),
  expenseCategories: structuredClone(initialExpenseCategories),
});

const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const currencyValue = (value) => {
  if (typeof value === 'number') return value;
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits ? Number(digits) / 100 : 0;
};
const statusClass = (status) => status.toLowerCase().replaceAll(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const downloadCsv = (fileName, headers, rows) => {
  const csv = `\ufeff${headers.map(csvCell).join(';')}\n${rows.map((row) => row.map(csvCell).join(';')).join('\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
const downloadJson = (fileName, content) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
const dateToIso = (date) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};
const dateFieldValue = (value, fallback = '') => !value ? fallback : String(value).includes('-') ? value : dateToIso(value);
const inRange = (date, start, end) => (!start || date >= start) && (!end || date <= end);
const todayDisplay = () => new Intl.DateTimeFormat('pt-BR').format(new Date());
const parseBrDate = (value) => {
  const [day, month, year] = String(value).split('/').map(Number);
  return new Date(year, month - 1, day);
};
const parseDate = (value) => String(value).includes('-') ? new Date(`${value}T12:00:00`) : parseBrDate(value);
const formatBrDate = (value) => value.toLocaleDateString('pt-BR');
const dateInputValue = () => new Date().toISOString().slice(0, 10);
const timestampLabel = (value) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
const maxAttachmentBytes = 1024 * 1024;
const storedAttachments = async (files, existing = []) => {
  const selected = [...files].filter((file) => file?.name);
  if (!selected.length) return existing || [];
  if (selected.some((file) => file.size > maxAttachmentBytes)) throw new Error('Cada anexo deve ter no máximo 1 MB. Reduza a foto ou documento antes de enviar.');
  if ((existing?.length || 0) + selected.length > 8) throw new Error('Mantenha no máximo 8 anexos por cadastro.');
  const converted = await Promise.all(selected.map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Não foi possível ler o arquivo ${file.name}.`));
    reader.onload = () => resolve({ id: `${Date.now()}-${crypto.randomUUID()}`, name: file.name, type: file.type, size: file.size, dataUrl: reader.result });
    reader.readAsDataURL(file);
  })));
  return [...(existing || []), ...converted];
};
const firstRentalDueDate = (start, dueDay) => {
  const eligible = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 30);
  const buildDue = (year, month) => new Date(year, month, Math.min(Number(dueDay) || 1, new Date(year, month + 1, 0).getDate()));
  let due = buildDue(eligible.getFullYear(), eligible.getMonth());
  if (due < eligible) due = buildDue(eligible.getFullYear(), eligible.getMonth() + 1);
  return due;
};
const api = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, { credentials: 'include', headers: { 'content-type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a solicitação.');
  return data;
};
const isOpenCharge = (item) => !['Pago', 'Cancelada', 'Substituída por saldo'].includes(item.status);
const depositSituation = (item) => {
  if (item.status === 'Cancelada') return 'Cancelada';
  if (item.depositStatus) return item.depositStatus;
  return item.status === 'Pago' ? 'Em posse' : 'A receber';
};
const terminationCalculation = (contract, terminationValue) => {
  if (!contract || !terminationValue) return { totalDays: 0, remainingDays: 0, calculatedPenalty: 0 };
  const start = parseBrDate(contract.start);
  const end = parseBrDate(contract.end);
  const termination = parseDate(terminationValue);
  if ([start, end, termination].some((date) => Number.isNaN(date.getTime()))) return { totalDays: 0, remainingDays: 0, calculatedPenalty: 0 };
  const totalDays = Math.max(1, Math.ceil((end - start) / 86400000));
  const remainingDays = Math.max(0, Math.ceil((end - termination) / 86400000));
  return {
    totalDays,
    remainingDays,
    calculatedPenalty: Number(contract.rent) * (Number(contract.penaltyMultiplier) || 0) * remainingDays / totalDays,
  };
};

function useStoredState(key, initialValue, remoteEnabled = false) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  useEffect(() => {
    if (!remoteEnabled) return undefined;
    let active = true;
    api(`/data/${encodeURIComponent(key)}`).then((result) => {
      if (!active) return;
      if (result.exists) setValue(result.value);
      setRemoteLoaded(true);
    }).catch(() => setRemoteLoaded(false));
    return () => { active = false; };
  }, [key, remoteEnabled]);
  useEffect(() => {
    if (!remoteEnabled || !remoteLoaded) return;
    api(`/data/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ value }) }).catch(() => {});
  }, [key, value, remoteEnabled, remoteLoaded]);
  return [value, setValue];
}

function App() {
  const [page, setPage] = useState('Visão geral');
  const [dataReady, setDataReady] = useState(false);
  const [units, setUnits] = useStoredState('cb-gestao:unidades', initialUnits, dataReady);
  const [charges, setCharges] = useStoredState('cb-gestao:cobrancas', initialCharges, dataReady);
  const [expenses, setExpenses] = useStoredState('cb-gestao:despesas', initialExpenses, dataReady);
  const [bank, setBank] = useStoredState('cb-gestao:extrato', bankItems, dataReady);
  const [contracts, setContracts] = useStoredState('cb-gestao:contratos', initialContracts, dataReady);
  const [maintenances, setMaintenances] = useStoredState('cb-gestao:manutencoes', initialMaintenances, dataReady);
  const [terminations, setTerminations] = useStoredState('cb-gestao:distratos', initialTerminations, dataReady);
  const [tenants, setTenants] = useStoredState('cb-gestao:inquilinos', initialTenants, dataReady);
  const [bankAccounts, setBankAccounts] = useStoredState('cb-gestao:contas-bancarias', initialBankAccounts, dataReady);
  const [suppliers, setSuppliers] = useStoredState('cb-gestao:fornecedores', initialSuppliers, dataReady);
  const [expenseCategories, setExpenseCategories] = useStoredState('cb-gestao:categorias-despesa', initialExpenseCategories, dataReady);
  const [restorePoints, setRestorePoints] = useStoredState('cb-gestao:pontos-restauracao', [], dataReady);
  const [users, setUsers] = useState([]);
  const [accessProfiles, setAccessProfiles] = useState(defaultAccessProfiles);
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [showChargeForm, setShowChargeForm] = useState(null);
  const [receiptCharge, setReceiptCharge] = useState(null);
  const [depositManagement, setDepositManagement] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(null);
  const [showContractForm, setShowContractForm] = useState(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(null);
  const [maintenanceReport, setMaintenanceReport] = useState(null);
  const [registrationForm, setRegistrationForm] = useState(null);
  const [bankEdit, setBankEdit] = useState(null);
  const [showTerminationForm, setShowTerminationForm] = useState(null);
  const [tenantProfile, setTenantProfile] = useState(null);
  const signedUser = session?.user?.status === 'Ativo' ? session.user : null;
  const activeProfile = accessProfiles[signedUser?.role];
  const activeUser = signedUser && activeProfile && (activeProfile.status || 'Ativo') === 'Ativo' ? signedUser : null;

  const income = useMemo(() => charges.filter((item) => item.type !== 'Caução').reduce((sum, item) => sum + (item.status === 'Cancelada' ? 0 : item.receivedAmount ?? (item.status === 'Pago' ? item.amount : 0)), 0), [charges]);
  const paidExpenses = useMemo(() => expenses.filter((item) => item.status !== 'Cancelada').reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const openCharges = useMemo(() => charges.filter(isOpenCharge), [charges]);
  const occupancy = units.filter((unit) => unit.status === 'Ocupada').length;

  const inform = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const navigate = (next) => {
    if (!activeProfile?.pages.includes(next)) return;
    setPage(next);
    setShowChargeForm(false);
    setReceiptCharge(null);
    setShowExpenseForm(false);
  };

  const loadAccess = async () => {
    const current = await api('/auth/me');
    setSession({ user: current.user });
    setAccessProfiles(current.profiles || defaultAccessProfiles);
    if (current.user.role === 'Administrador Geral') setUsers((await api('/users')).users);
    setDataReady(true);
  };
  useEffect(() => { loadAccess().catch(() => { setSession(null); setDataReady(false); }).finally(() => setAuthReady(true)); }, []);

  const authenticate = async (username, pin) => {
    await api('/auth/login', { method: 'POST', body: JSON.stringify({ username, pin }) });
    await loadAccess();
    return true;
  };
  const saveUser = async (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const payload = { name: form.get('name'), username: form.get('username'), email: form.get('email'), role: form.get('role'), status: form.get('status'), pin: form.get('pin') };
      const result = record ? await api(`/users/${record.id}`, { method: 'PATCH', body: JSON.stringify(payload) }) : await api('/users', { method: 'POST', body: JSON.stringify(payload) });
      setUsers((items) => record ? items.map((item) => item.id === record.id ? result.user : item) : [...items, result.user]);
    } catch (error) { inform(error.message); return; }
    setRegistrationForm(null);
    inform(record ? 'Usuário e permissões atualizados.' : 'Usuário cadastrado com perfil de acesso.');
  };
  const saveAccessProfile = async (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const pages = form.getAll('pages');
    if (!name) return;
    if (!record && accessProfiles[name]) {
      inform('Já existe um nível de acesso com este nome.');
      return;
    }
    if (!pages.length && name !== 'Administrador Geral') {
      inform('Selecione ao menos uma tela para este nível de acesso.');
      return;
    }
    const profileName = record?.name || name;
    try {
      const result = record ? await api(`/profiles/${encodeURIComponent(profileName)}`, { method: 'PATCH', body: JSON.stringify({ pages, status: form.get('status') }) }) : await api('/profiles', { method: 'POST', body: JSON.stringify({ name, pages, status: form.get('status') }) });
      setAccessProfiles(result.profiles);
    } catch (error) { inform(error.message); return; }
    setRegistrationForm(null);
    inform(record ? 'Nível de acesso atualizado.' : 'Novo nível de acesso criado.');
  };
  const saveUnit = async (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let attachments;
    try { attachments = await storedAttachments(form.getAll('attachments'), record.attachments); }
    catch (error) { inform(error.message); return; }
    const next = { ...record, name: form.get('name'), status: form.get('status'), tenant: form.get('tenant') || '—', rent: currencyValue(form.get('rent')), description: form.get('description'), cagece: form.get('cagece'), enel: form.get('enel'), iptu: form.get('iptu'), attachments };
    setUnits((items) => items.map((item) => item.id === record.id ? next : item));
    setRegistrationForm(null);
    inform('Unidade atualizada, incluindo identificação de contas, descrição e anexos.');
  };

  const currentData = () => ({
    units, charges, expenses, bank, contracts, maintenances, terminations, tenants, bankAccounts, suppliers, expenseCategories,
  });
  const applyData = (data) => {
    setUnits(data.units || structuredClone(initialUnits));
    setCharges(data.charges || []);
    setExpenses(data.expenses || []);
    setBank(data.bank || []);
    setContracts(data.contracts || []);
    setMaintenances(data.maintenances || []);
    setTerminations(data.terminations || []);
    setTenants(data.tenants || []);
    setBankAccounts(data.bankAccounts || []);
    setSuppliers(data.suppliers || []);
    setExpenseCategories(data.expenseCategories || []);
  };
  useEffect(() => {
    const referenceVersionKey = 'cb-gestao:reference-version';
    if (window.localStorage.getItem(referenceVersionKey) === '2') return;
    const point = {
      id: `restore-${Date.now()}`,
      name: 'Antes da importação da planilha de referência',
      createdAt: new Date().toISOString(),
      data: structuredClone(currentData()),
    };
    setRestorePoints((items) => [point, ...items].slice(0, 30));
    applyData(referenceData());
    window.localStorage.setItem(referenceVersionKey, '2');
  }, []);
  const saveRestorePoint = (name = 'Ponto de restauração') => {
    const point = {
      id: `restore-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      data: structuredClone(currentData()),
    };
    setRestorePoints((items) => [point, ...items].slice(0, 30));
    inform('Ponto de restauração criado com todos os dados atuais.');
  };
  const restorePoint = (point) => {
    if (!point?.data) return;
    applyData(structuredClone(point.data));
    navigate('Visão geral');
    inform(`Dados restaurados do ponto “${point.name}”.`);
  };
  const importBackup = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      if (backup.application !== 'CB Gestão de Kitnets' || !backup.data || typeof backup.data !== 'object') throw new Error('Selecione um arquivo de backup válido da CB Gestão.');
      applyData(backup.data);
      if (Array.isArray(backup.restorePoints)) setRestorePoints(backup.restorePoints.slice(0, 30));
      navigate('Visão geral');
      inform('Backup importado. Todos os dados atuais foram substituídos pela cópia selecionada.');
    } catch (error) { inform(error.message || 'Não foi possível importar o backup.'); }
    finally { event.target.value = ''; }
  };
  const exportBackup = () => {
    const exportedAt = new Date().toISOString();
    downloadJson(`cb-gestao-backup-${exportedAt.slice(0, 10)}.json`, {
      application: 'CB Gestão de Kitnets', version: 1, exportedAt, data: currentData(), restorePoints,
    });
    inform('Backup geral exportado em JSON. Guarde o arquivo em local seguro.');
  };

  const confirmBankItem = (id) => {
    setBank((items) => items.map((item) => item.id === id ? { ...item, state: 'Conciliada' } : item));
    inform('Conciliação confirmada. A ação ficará auditável na versão com banco de dados.');
  };

  const importStatement = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = parseStatementCsv(await file.text());
      const existing = new Set(bank.map((item) => `${item.date}|${item.description}|${item.amount}|${item.direction}`));
      const fresh = imported.filter((item) => !existing.has(`${item.date}|${item.description}|${item.amount}|${item.direction}`));
      setBank((items) => [...fresh, ...items]);
      inform(fresh.length ? `${fresh.length} transação(ões) importada(s) para conciliação.` : 'Não há novas transações. O arquivo parece já ter sido importado.');
    } catch (error) {
      inform(error.message || 'Não foi possível importar o arquivo.');
    } finally {
      event.target.value = '';
    }
  };

  const registerReceipt = (event, charge) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = currencyValue(form.get('amount'));
    const adjustmentType = form.get('adjustmentType');
    const receivedOn = parseDate(form.get('receivedOn'));
    if (!Number.isFinite(amount) || amount <= 0 || Number.isNaN(receivedOn.getTime())) {
      inform('Informe um valor de pagamento maior que zero e uma data válida.');
      return;
    }
    const remainingForValidation = Math.max(0, charge.amount - (charge.settledAmount ?? charge.receivedAmount ?? 0));
    const hasDifference = Math.abs(amount - remainingForValidation) > 0.001;
    const validAdjustment = !hasDifference || (amount < remainingForValidation && ['discount', 'partial'].includes(adjustmentType)) || (amount > remainingForValidation && adjustmentType === 'penaltyInterest');
    if (!validAdjustment) {
      inform(amount < remainingForValidation ? 'Para um valor menor que o saldo, informe desconto concedido ou pagamento parcial.' : 'Para um valor maior que o saldo, informe a aplicação de multa e juros.');
      return;
    }
    const extraAmount = currencyValue(form.get('extraAmount'));
    const extraReference = String(form.get('extraReference') || '').trim();
    if (adjustmentType === 'penaltyInterest' && (!Number.isFinite(extraAmount) || Math.abs(extraAmount - Math.abs(amount - remainingForValidation)) > 0.001 || !extraReference)) {
      inform('Informe o valor extra calculado e a referência da multa, juros ou outro acréscimo.');
      return;
    }
    const newInvoiceDue = form.get('newInvoiceDue');
    if (adjustmentType === 'partial' && Number.isNaN(parseDate(newInvoiceDue).getTime())) {
      inform('Informe o vencimento da nova fatura de saldo restante.');
      return;
    }
    setCharges((items) => {
      const updated = items.map((item) => {
      if (item.id !== charge.id) return item;
      const previousReceipts = item.receipts || [];
      const previousAmount = item.receivedAmount || 0;
      const previousSettled = item.settledAmount ?? previousAmount;
      const remaining = Math.max(0, item.amount - previousSettled);
      const difference = Math.abs(amount - remaining);
      const discountAmount = adjustmentType === 'discount' ? difference : 0;
      const penaltyInterestAmount = adjustmentType === 'penaltyInterest' ? extraAmount : 0;
      const settledAmount = previousSettled + (adjustmentType === 'discount' ? amount + discountAmount : Math.min(amount, remaining));
      const receivedAmount = previousAmount + amount;
      return {
        ...item,
        receipts: [...previousReceipts, { id: Date.now(), amount, receivedOn: formatBrDate(receivedOn), information: form.get('information'), adjustmentType, discountAmount, penaltyInterestAmount, extraReference }],
        receivedAmount,
        settledAmount: adjustmentType === 'partial' ? item.amount : settledAmount,
        discountAmount: (item.discountAmount || 0) + discountAmount,
        penaltyInterestAmount: (item.penaltyInterestAmount || 0) + penaltyInterestAmount,
        extraReference: adjustmentType === 'penaltyInterest' ? extraReference : item.extraReference,
        paidAt: formatBrDate(receivedOn),
        receiptInformation: form.get('information'),
        status: adjustmentType === 'partial' ? 'Substituída por saldo' : settledAmount >= item.amount ? 'Pago' : 'Parcial',
      };
      });
      if (adjustmentType !== 'partial') return updated;
      const balance = Math.max(0, remainingForValidation - amount);
      return [...updated, { id: `balance-${charge.id}-${Date.now()}`, originChargeId: charge.id, contractId: charge.contractId, unit: charge.unit, tenant: charge.tenant, due: formatBrDate(parseDate(newInvoiceDue)), competence: charge.competence, type: charge.type === 'Caução' ? 'Caução' : 'Saldo remanescente', amount: balance, status: 'Em aberto', paidAt: null }];
    });
    setReceiptCharge(null);
    inform(adjustmentType === 'partial' ? 'Recebimento parcial registrado e nova fatura gerada com o saldo restante.' : charge.type === 'Caução' ? 'Caução recebida e registrada como valor em posse. Ela não compõe a receita de aluguel.' : 'Recebimento registrado com valor, data e informação. O valor já compõe o resultado de caixa.');
  };

  const saveDepositManagement = (event, charge) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const depositStatus = form.get('depositStatus');
    const processedAt = form.get('processedAt');
    if (depositStatus !== 'Em posse' && Number.isNaN(parseDate(processedAt).getTime())) {
      inform('Informe a data em que a caução foi devolvida, utilizada ou compensada.');
      return;
    }
    setCharges((items) => items.map((item) => item.id === charge.id ? {
      ...item,
      depositStatus,
      depositProcessedAt: processedAt ? formatBrDate(parseDate(processedAt)) : '',
      depositNote: String(form.get('depositNote') || '').trim(),
    } : item));
    setDepositManagement(null);
    inform(depositStatus === 'Em posse' ? 'Caução mantida sob guarda.' : `Situação da caução atualizada para “${depositStatus}”.`);
  };

  const saveCharge = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = { ...(record || {}), id: record?.id || Date.now(), unit: form.get('unit'), tenant: form.get('tenant'), due: formatBrDate(parseDate(form.get('due'))), amount: currencyValue(form.get('amount')), status: form.get('status') };
    setCharges((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, { ...next, paidAt: null }]);
    setShowChargeForm(null);
    inform(record ? 'Cobrança atualizada.' : 'Cobrança incluída para validação local.');
  };

  const cancelCharge = (record) => { setCharges((items) => items.map((item) => item.id === record.id ? { ...item, status: 'Cancelada', cancelledAt: todayDisplay() } : item)); inform('Cobrança cancelada sem exclusão do histórico.'); };
  const cancelExpense = (record) => { setExpenses((items) => items.map((item) => item.id === record.id ? { ...item, status: 'Cancelada', cancelledAt: todayDisplay() } : item)); inform('Despesa cancelada sem exclusão do histórico.'); };

  const saveExpense = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const paidAt = form.get('paidAt') ? formatBrDate(parseDate(form.get('paidAt'))) : '';
    const next = {
      ...(record || {}),
      id: record?.id || Date.now(),
      date: formatBrDate(parseDate(form.get('includedAt'))), dueDate: formatBrDate(parseDate(form.get('dueDate'))), paidAt, description: form.get('description'), supplier: form.get('supplier'), unit: form.get('unit'), maintenanceId: form.get('maintenanceId') || '', category: form.get('category'), amount: currencyValue(form.get('amount')), status: paidAt && form.get('status') === 'Pendente' ? 'Paga' : form.get('status'),
    };
    setExpenses((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setShowExpenseForm(null);
    inform(record ? 'Despesa atualizada.' : 'Despesa incluída para validação local.');
  };

  const saveContract = async (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const attachment = form.get('attachment');
    const start = parseDate(form.get('start'));
    const end = parseDate(form.get('end'));
    const overlaps = form.get('status') === 'Ativo' && contracts.some((item) => item.id !== record?.id && item.unit === form.get('unit') && item.status === 'Ativo' && start <= parseBrDate(item.end) && end >= parseBrDate(item.start));
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end || overlaps) {
      inform(overlaps ? 'Esta kitnet já possui contrato vigente em parte do período informado.' : 'Revise as datas do contrato.');
      return;
    }
    let inspectionAttachments;
    try { inspectionAttachments = await storedAttachments(form.getAll('inspectionAttachments'), record?.inspectionAttachments); }
    catch (error) { inform(error.message); return; }
    const depositAmount = currencyValue(form.get('depositAmount'));
    const depositDueAt = form.get('depositDue') ? parseDate(form.get('depositDue')) : start;
    if (depositAmount > 0 && Number.isNaN(depositDueAt.getTime())) {
      inform('Informe uma data válida para o vencimento da caução.');
      return;
    }
    const next = {
      ...(record || {}), id: record?.id || Date.now(), unit: form.get('unit'), tenant: form.get('tenant'), start: formatBrDate(parseDate(form.get('start'))), end: formatBrDate(parseDate(form.get('end'))), dueDay: Number(form.get('dueDay')), penaltyMultiplier: Number(form.get('penaltyMultiplier')), rent: currencyValue(form.get('rent')), depositAmount, depositDue: depositAmount > 0 ? formatBrDate(depositDueAt) : '', status: form.get('status'), attachmentName: attachment?.size ? attachment.name : record?.attachmentName || '', inspectionAttachments,
    };
    setContracts((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setCharges((items) => {
      const existing = items.find((item) => item.contractId === next.id && item.type === 'Caução');
      if (!depositAmount) return existing?.status === 'Em aberto' ? items.map((item) => item.id === existing.id ? { ...item, status: 'Cancelada', cancelledAt: todayDisplay() } : item) : items;
      const deposit = { id: `deposit-${next.id}`, contractId: next.id, unit: next.unit, tenant: next.tenant, due: next.depositDue, competence: 'Caução', type: 'Caução', amount: depositAmount, status: 'Em aberto', paidAt: null };
      return existing ? items.map((item) => item.id === existing.id && item.status !== 'Pago' ? { ...item, ...deposit } : item) : [...items, deposit];
    });
    setShowContractForm(null);
    inform(depositAmount ? `Contrato salvo e caução de ${money(depositAmount)} lançada em Cobranças.` : 'Contrato cadastrado. Gere as cobranças de aluguel quando desejar.');
  };

  const saveTermination = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const contract = contracts.find((item) => String(item.id) === form.get('contractId'));
    const terminationAt = parseDate(form.get('terminationDate'));
    const penaltyDueAt = parseDate(form.get('penaltyDue'));
    if (!contract || Number.isNaN(terminationAt.getTime()) || Number.isNaN(penaltyDueAt.getTime())) {
      inform('Selecione um contrato e datas válidas para o distrato e para o vencimento da multa.');
      return;
    }
    const start = parseBrDate(contract.start);
    const end = parseBrDate(contract.end);
    if (terminationAt < start || terminationAt > end) {
      inform('A data do distrato precisa estar dentro do período contratado.');
      return;
    }
    const { totalDays, remainingDays, calculatedPenalty } = terminationCalculation(contract, form.get('terminationDate'));
    const multiplier = Number(contract.penaltyMultiplier) || 0;
    const finalPenalty = currencyValue(form.get('finalPenalty'));
    const terminationDate = formatBrDate(terminationAt);
    const penaltyDue = formatBrDate(penaltyDueAt);
    const termination = { ...(record || {}), id: record?.id || Date.now(), status: 'Ativo', contractId: contract.id, unit: contract.unit, tenant: contract.tenant, terminationDate, penaltyDue, originalEnd: contract.end, totalDays, remainingDays, multiplier, calculatedPenalty, finalPenalty: Number.isFinite(finalPenalty) ? finalPenalty : calculatedPenalty, reason: form.get('reason'), observations: form.get('observations') };
    setTerminations((items) => record ? items.map((item) => item.id === record.id ? termination : item) : [...items, termination]);
    setContracts((items) => items.map((item) => item.id === contract.id ? { ...item, status: 'Distratado', terminationDate } : item));
    setCharges((items) => {
      const updated = items.map((item) => {
        if (item.contractId === contract.id && item.type === 'Multa rescisória') return { ...item, due: penaltyDue, amount: termination.finalPenalty, status: item.status === 'Pago' ? 'Pago' : 'Em aberto' };
        const belongsToContract = item.contractId === contract.id || (!item.contractId && item.unit === contract.unit && item.tenant === contract.tenant);
        return belongsToContract && item.status === 'Em aberto' && parseBrDate(item.due) > terminationAt ? { ...item, status: 'Cancelada', cancellationSource: `termination-${termination.id}` } : item;
      });
      const penaltyExists = updated.some((item) => item.contractId === contract.id && item.type === 'Multa rescisória');
      return penaltyExists ? updated : [...updated, { id: `penalty-${contract.id}`, contractId: contract.id, unit: contract.unit, tenant: contract.tenant, due: penaltyDue, competence: 'Distrato', type: 'Multa rescisória', amount: termination.finalPenalty, status: 'Em aberto', paidAt: null }];
    });
    setShowTerminationForm(null);
    inform(record ? `Distrato atualizado. Multa rescisória ajustada para ${money(termination.finalPenalty)}.` : `Distrato registrado. Multa rescisória de ${money(termination.finalPenalty)} lançada para cobrança.`);
  };

  const cancelTermination = (termination) => {
    const penalty = charges.find((item) => item.contractId === termination.contractId && item.type === 'Multa rescisória');
    if (penalty?.status === 'Pago') { inform('A multa rescisória já foi recebida. Registre a devolução ou ajuste financeiro antes de cancelar o distrato.'); return; }
    setTerminations((items) => items.map((item) => item.id === termination.id ? { ...item, status: 'Cancelado', cancelledAt: todayDisplay() } : item));
    setContracts((items) => items.map((item) => item.id === termination.contractId ? { ...item, status: 'Ativo', terminationDate: '' } : item));
    setCharges((items) => items.map((item) => {
      if (item.contractId === termination.contractId && item.type === 'Multa rescisória') return { ...item, status: 'Cancelada', cancelledAt: todayDisplay() };
      return item.cancellationSource === `termination-${termination.id}` && item.status === 'Cancelada' ? { ...item, status: 'Em aberto', cancellationSource: '' } : item;
    }));
    inform('Distrato cancelado. Contrato reativado, cobranças futuras restauradas e multa cancelada.');
  };

  const generateContractCharges = (contract) => {
    const start = parseBrDate(contract.start);
    const end = parseBrDate(contract.end);
    const dueDay = Number(contract.dueDay) || start.getDate();
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      inform('Revise o período do contrato antes de gerar as cobranças.');
      return;
    }
    const firstDue = firstRentalDueDate(start, dueDay);
    const newCharges = [];
    for (let cursor = new Date(firstDue.getFullYear(), firstDue.getMonth(), 1); cursor <= end; cursor.setMonth(cursor.getMonth() + 1)) {
      const lastDay = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
      const dueDate = new Date(cursor.getFullYear(), cursor.getMonth(), Math.min(dueDay, lastDay));
      if (dueDate < firstDue || dueDate > end) continue;
      const due = formatBrDate(dueDate);
      const competence = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`;
      newCharges.push({ id: `contract-${contract.id}-${competence}`, contractId: contract.id, unit: contract.unit, tenant: contract.tenant, due, competence, amount: Number(contract.rent), status: 'Em aberto', paidAt: null });
    }
    setCharges((items) => {
      const unique = newCharges.filter((charge) => !items.some((item) => item.contractId === charge.contractId && item.competence === charge.competence) && !items.some((item) => item.unit === charge.unit && item.tenant === charge.tenant && item.due === charge.due));
      if (!unique.length) {
        inform('Todas as cobranças previstas para este contrato já foram geradas.');
        return items;
      }
      inform(`${unique.length} cobrança(s) de aluguel gerada(s). Primeiro vencimento: ${formatBrDate(firstDue)}.`);
      return [...items, ...unique];
    });
  };

  const saveBankItem = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = { ...bankEdit, date: formatBrDate(parseDate(form.get('date'))), description: form.get('description'), amount: currencyValue(form.get('amount')), direction: form.get('direction'), state: form.get('state') };
    setBank((items) => items.map((item) => item.id === bankEdit.id ? next : item));
    setBankEdit(null);
    inform('Transação bancária atualizada.');
  };

  const saveMaintenance = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { estimated, actual, ...previous } = record || {};
    const next = { ...previous, id: record?.id || Date.now(), openedAt: formatBrDate(parseDate(form.get('openedAt'))), title: form.get('title'), unit: form.get('unit'), priority: form.get('priority'), status: form.get('status'), supplier: form.get('supplier') || 'A definir', observations: form.get('observations') };
    setMaintenances((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setShowMaintenanceForm(null);
    inform(record ? 'Manutenção atualizada.' : 'Manutenção registrada. Você poderá associar a despesa quando ela for paga.');
  };

  const saveTenant = async (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let attachments;
    try { attachments = await storedAttachments(form.getAll('attachments'), record?.attachments); }
    catch (error) { inform(error.message); return; }
    const next = { ...(record || {}), id: record?.id || Date.now(), name: form.get('name'), cpf: form.get('cpf'), phone: form.get('phone'), email: form.get('email'), status: form.get('status'), observations: form.get('observations'), attachments };
    setTenants((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setRegistrationForm(null);
    inform(record ? 'Inquilino atualizado.' : 'Inquilino cadastrado localmente.');
  };

  const saveBankAccount = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = { ...(record || {}), id: record?.id || Date.now(), bank: form.get('bank'), account: form.get('account'), type: form.get('type'), status: form.get('status') };
    setBankAccounts((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setRegistrationForm(null);
    inform(record ? 'Conta bancária atualizada.' : 'Conta bancária cadastrada.');
  };

  const saveSupplier = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = { ...(record || {}), id: record?.id || Date.now(), name: form.get('name'), document: form.get('document'), phone: form.get('phone'), category: form.get('category'), status: form.get('status') };
    setSuppliers((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setRegistrationForm(null);
    inform(record ? 'Fornecedor atualizado.' : 'Fornecedor cadastrado.');
  };

  const saveExpenseCategory = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parentId = form.get('parentId');
    const next = { ...(record || {}), id: record?.id || Date.now(), name: form.get('name'), description: form.get('description'), parentId: parentId ? Number(parentId) : '', status: form.get('status') };
    setExpenseCategories((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setRegistrationForm(null);
    inform(record ? 'Categoria atualizada.' : 'Categoria cadastrada.');
  };

  if (!authReady) return <main className="auth-shell"><section className="auth-card"><p>Verificando acesso...</p></section></main>;
  if (!activeUser) return <Authentication onLogin={authenticate} />;
  const menu = activeProfile?.pages || [];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><img src="/logo-cb.png" alt="CB Gestão" /></div>
      <select className="mobile-page-select" value={page} onChange={(event) => navigate(event.target.value)} aria-label="Ir para uma tela">
        {menu.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <nav>{menu.map((item) => <button className={page === item ? 'nav-item active' : 'nav-item'} key={item} onClick={() => navigate(item)}>{item}</button>)}</nav>
      <div className="sidebar-bottom"><span className="avatar">{activeUser.name.slice(0, 1).toUpperCase()}</span><div><b>{activeUser.name}</b><small>{activeUser.role}</small></div><button className="logout-button" onClick={() => { api('/auth/logout', { method: 'POST' }).catch(() => {}); setSession(null); setDataReady(false); }}>Sair</button></div>
      <button className="mobile-logout" onClick={() => { api('/auth/logout', { method: 'POST' }).catch(() => {}); setSession(null); setDataReady(false); }}>Sair</button>
    </aside>
    <main className="main">
      <header><div><p className="eyebrow">SETEMBRO DE 2026</p><h1>{page}</h1></div><button className="import-button" onClick={() => navigate('Conciliação')}>Importar extrato</button></header>
      {notice && <div className="toast">{notice}</div>}
      {page === 'Visão geral' && <Dashboard income={income} expenses={paidExpenses} openCharges={openCharges} occupancy={occupancy} pendingBank={bank.filter((item) => item.state !== 'Conciliada').length} navigate={navigate} />}
      {page === 'Unidades' && <Units items={units} tenants={tenants} edit={(record) => setRegistrationForm({ type: 'unit', record })} form={registrationForm?.type === 'unit' && <UnitForm record={registrationForm.record} tenants={tenants} onClose={() => setRegistrationForm(null)} onSubmit={saveUnit} />} />}
      {page === 'Contratos' && <Contracts items={contracts} charges={charges} generateCharges={generateContractCharges} edit={(record) => setShowContractForm(record)} openForm={() => setShowContractForm({})} form={showContractForm && <ContractForm record={showContractForm.id ? showContractForm : null} tenants={tenants} units={units} onClose={() => setShowContractForm(null)} onSubmit={saveContract} />} />}
      {page === 'Cobranças' && <Charges items={charges} registerReceipt={setReceiptCharge} manageDeposit={setDepositManagement} edit={setShowChargeForm} cancel={cancelCharge} openForm={() => setShowChargeForm({})} form={<>{showChargeForm && <ChargeForm record={showChargeForm.id ? showChargeForm : null} units={units} onClose={() => setShowChargeForm(null)} onSubmit={saveCharge} />}{receiptCharge && <ReceiptForm charge={receiptCharge} onClose={() => setReceiptCharge(null)} onSubmit={registerReceipt} />}{depositManagement && <DepositManagementForm charge={depositManagement} onClose={() => setDepositManagement(null)} onSubmit={saveDepositManagement} />}</>} />}
      {page === 'Conciliação' && <Reconciliation items={bank} confirm={confirmBankItem} edit={setBankEdit} importStatement={importStatement} inform={inform} form={bankEdit && <BankTransactionForm record={bankEdit} onClose={() => setBankEdit(null)} onSubmit={saveBankItem} />} />}
      {page === 'Despesas' && <Expenses items={expenses} maintenances={maintenances} edit={(record) => setShowExpenseForm(record)} cancel={cancelExpense} openForm={() => setShowExpenseForm({})} form={showExpenseForm && <ExpenseForm record={showExpenseForm.id ? showExpenseForm : null} units={units} categories={expenseCategories} suppliers={suppliers} maintenances={maintenances} onClose={() => setShowExpenseForm(null)} onSubmit={saveExpense} />} />}
      {page === 'Manutenções' && <Maintenances items={maintenances} expenses={expenses} openForm={() => setShowMaintenanceForm({})} edit={setShowMaintenanceForm} showReport={setMaintenanceReport} form={<>{showMaintenanceForm && <MaintenanceForm record={showMaintenanceForm.id ? showMaintenanceForm : null} units={units} onClose={() => setShowMaintenanceForm(null)} onSubmit={saveMaintenance} />}{maintenanceReport && <MaintenanceDetailReport maintenance={maintenanceReport} expenses={expenses.filter((item) => String(item.maintenanceId) === String(maintenanceReport.id))} onClose={() => setMaintenanceReport(null)} />}</>} />}
      {page === 'Distratos' && <Terminations items={terminations} charges={charges} cancel={cancelTermination} openForm={() => setShowTerminationForm({})} edit={setShowTerminationForm} form={showTerminationForm && <TerminationForm record={showTerminationForm.id ? showTerminationForm : null} contracts={contracts} onClose={() => setShowTerminationForm(null)} onSubmit={saveTermination} />} />}
      {page === 'Cadastros' && <Registrations tenants={tenants} contracts={contracts} bankAccounts={bankAccounts} suppliers={suppliers} categories={expenseCategories} users={users} accessProfiles={accessProfiles} isAdministrator={activeUser.role === 'Administrador Geral'} profile={tenantProfile} closeProfile={() => setTenantProfile(null)} openProfile={setTenantProfile} openForm={(type, record = null) => setRegistrationForm({ type, record })} form={registrationForm?.type === 'tenant' ? <TenantForm record={registrationForm.record} onClose={() => setRegistrationForm(null)} onSubmit={saveTenant} /> : registrationForm?.type === 'account' ? <BankAccountForm record={registrationForm.record} onClose={() => setRegistrationForm(null)} onSubmit={saveBankAccount} /> : registrationForm?.type === 'supplier' ? <SupplierForm record={registrationForm.record} onClose={() => setRegistrationForm(null)} onSubmit={saveSupplier} /> : registrationForm?.type === 'category' ? <ExpenseCategoryForm record={registrationForm.record} categories={expenseCategories} onClose={() => setRegistrationForm(null)} onSubmit={saveExpenseCategory} /> : registrationForm?.type === 'user' ? <UserForm record={registrationForm.record} accessProfiles={accessProfiles} onClose={() => setRegistrationForm(null)} onSubmit={saveUser} /> : registrationForm?.type === 'accessProfile' ? <AccessProfileForm record={registrationForm.record} onClose={() => setRegistrationForm(null)} onSubmit={saveAccessProfile} /> : null} />}
      {page === 'Relatórios' && <Reports charges={charges} expenses={expenses} suppliers={suppliers} maintenances={maintenances} units={units} />}
      {page === 'Backups' && <Backups points={restorePoints} createPoint={saveRestorePoint} restorePoint={restorePoint} exportBackup={exportBackup} importBackup={importBackup} />}
    </main>
  </div>;
}

function Authentication({ onLogin }) {
  const [error, setError] = useState('');
  const submitLogin = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try { await onLogin(String(form.get('username')), String(form.get('pin'))); }
    catch (error) { setError(error.message); }
  };
  return <main className="auth-shell"><section className="auth-card"><img src="/logo-cb.png" alt="CB Gestão" /><div><p className="eyebrow">ACESSO RESTRITO</p><h1>Entrar no CB Gestão</h1><p>Use seu nome de usuário e PIN para acessar o sistema.</p></div><form className="form-grid auth-form" onSubmit={submitLogin}><label>Nome de usuário<input name="username" required autoComplete="username" placeholder="Seu usuário" /></label><label>PIN de 6 dígitos<input name="pin" type="password" inputMode="numeric" pattern="[0-9]{6}" required minLength="6" maxLength="6" autoComplete="current-password" placeholder="••••••" /></label>{error && <p className="auth-error">{error}</p>}<button className="solid-small auth-submit">Entrar</button></form><p className="auth-note">Não há cadastro público. Contas e redefinições de PIN são gerenciadas pelo Administrador Geral.</p></section></main>;
}

function Dashboard({ income, expenses, openCharges, occupancy, pendingBank, navigate }) {
  return <>
    <section className="metric-grid">
      <Metric label="Recebido no mês" value={money(income)} hint="Aluguéis confirmados" tone="green" />
      <Metric label="Despesas lançadas" value={money(expenses)} hint="Manutenção e serviços" tone="orange" />
      <Metric label="Resultado de caixa" value={money(income - expenses)} hint="Recebimentos menos despesas" tone="blue" />
      <Metric label="Ocupação" value={`${occupancy} de 12`} hint="2 unidades indisponíveis" tone="purple" />
    </section>
    <section className="two-columns">
      <article className="card"><div className="card-title"><div><p className="eyebrow">CONTAS A RECEBER</p><h2>Próximos vencimentos</h2></div><button className="link-button" onClick={() => navigate('Cobranças')}>Ver todas</button></div>
        <div className="list">{openCharges.map((item) => <div className="list-row" key={item.id}><div className="unit-icon">{item.unit.slice(-2)}</div><div><b>{item.unit}</b><small>{item.tenant} · vence {item.due}</small></div><div className="right"><b>{money(item.amount)}</b><span className={`badge ${statusClass(item.status)}`}>{item.status}</span></div></div>)}</div>
      </article>
      <article className="card"><div className="card-title"><div><p className="eyebrow">ATENÇÃO</p><h2>Para revisar hoje</h2></div></div>
        <div className="action-box"><span className="action-number">{pendingBank}</span><div><b>{pendingBank ? 'Transações aguardando conciliação' : 'Nenhuma transação pendente'}</b><small>{pendingBank ? 'Importe o extrato ou confirme as sugestões.' : 'Importe o extrato do Banco Inter quando houver movimentações.'}</small></div><button className="solid-small" onClick={() => navigate('Conciliação')}>Conciliar</button></div>
        <div className="action-box"><span className="action-number amber">{12 - occupancy}</span><div><b>Unidades sem ocupação</b><small>Kitnets 04 e 05 estão vagas na planilha de referência.</small></div><button className="plain-small" onClick={() => navigate('Unidades')}>Ver unidades</button></div>
      </article>
    </section>
  </>;
}

function Metric({ label, value, hint, tone }) { return <article className={`metric ${tone}`}><p>{label}</p><strong>{value}</strong><small>{hint}</small></article>; }

function Units({ items, tenants, edit, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">CADASTRO DO PRÉDIO</p><h2>{items.length} unidades</h2><small>Edite a identificação, contas, IPTU, descrição, fotos e documentos de cada kitnet.</small></div></div><div className="unit-grid">{items.map((unit) => <article className="unit-card" key={unit.id}><div className="unit-card-top"><span className={`status-dot ${statusClass(unit.status)}`}></span><span>{unit.status}</span></div><h3>{unit.name}</h3><p>{unit.tenant}</p><b>{unit.rent ? `${money(unit.rent)}/mês` : 'Sem valor mensal'}</b><small className="unit-doc-count">{unit.attachments?.length || 0} anexo(s) · Cagece: {unit.cagece || '—'}</small><button className="link-button" onClick={() => edit(unit)}>Editar unidade</button></article>)}</div></section></>; }

function Contracts({ items, charges, openForm, edit, generateCharges, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">CONTRATOS E COBRANÇAS</p><h2>Contratos</h2><small>O primeiro aluguel só vence no primeiro dia de vencimento após 30 dias do início. A caução é lançada em Cobranças.</small></div><button className="solid-small" onClick={openForm}>Novo contrato</button></div><Table headers={['Unidade', 'Inquilino', 'Período do contrato', '1º aluguel', 'Caução', 'Contrato', 'Vistoria', 'Situação', 'Ações']} rows={items.map((item) => { const firstDue = firstRentalDueDate(parseBrDate(item.start), item.dueDay || parseBrDate(item.start).getDate()); const deposit = charges.find((charge) => charge.contractId === item.id && charge.type === 'Caução'); return [item.unit, item.tenant, `${item.start} até ${item.end}`, formatBrDate(firstDue), item.depositAmount ? <span>{money(item.depositAmount)}<small className="receipt-value">{deposit?.status || 'Pendente'}</small></span> : 'Sem caução', item.attachmentName || 'Sem anexo', item.inspectionAttachments?.length ? `${item.inspectionAttachments.length} arquivo(s)` : 'Sem vistoria', <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>, <span className="row-actions">{item.status === 'Ativo' && <button className="table-action" onClick={() => generateCharges(item)}>Gerar aluguéis</button>}<button className="plain-small" onClick={() => edit(item)}>Editar</button></span>]; })} /></section></>; }

function Charges({ items, registerReceipt, manageDeposit, edit, cancel, openForm, form }) {
  const [filters, setFilters] = useState({ start: '', end: '', tenant: '' });
  const filtered = items.filter((item) => inRange(dateToIso(item.due), filters.start, filters.end) && (!filters.tenant || item.tenant === filters.tenant));
  return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">ALUGUÉIS · SET/2026</p><h2>Cobranças</h2></div><button className="solid-small" onClick={openForm}>Nova cobrança</button></div><FilterBar filters={filters} setFilters={setFilters} tenants={items.map((item) => item.tenant)} /><p className="filter-result">{filtered.length} cobrança(s) encontrada(s)</p><Table headers={['Unidade', 'Inquilino', 'Tipo', 'Vencimento', 'Valor', 'Situação', 'Recebimento', 'Ações']} rows={filtered.map((item) => [item.unit, item.tenant, item.type || 'Aluguel', item.due, money(item.amount), <span className={`badge ${statusClass(item.status)}`}>{item.type === 'Caução' ? depositSituation(item) : item.status}</span>, item.paidAt ? <span>{item.paidAt}<small className="receipt-value">{money(item.receivedAmount ?? item.amount)}</small>{item.type === 'Caução' && item.depositNote ? <small className="receipt-value">{item.depositNote}</small> : null}{item.penaltyInterestAmount ? <small className="receipt-value">Extra: {money(item.penaltyInterestAmount)} · {item.extraReference}</small> : null}</span> : '—', <span className="row-actions">{isOpenCharge(item) && <button className="table-action" onClick={() => registerReceipt(item)}>Receber</button>}{item.type === 'Caução' && item.status === 'Pago' && <button className="table-action" onClick={() => manageDeposit(item)}>Gerenciar caução</button>}<button className="plain-small" onClick={() => edit(item)}>Editar</button>{item.status !== 'Cancelada' && <button className="plain-small" onClick={() => cancel(item)}>Cancelar</button>}</span>])} /></section></>;
}

function Reconciliation({ items, confirm, edit, importStatement, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">BANCO INTER</p><h2>Conciliação bancária</h2><small>Importe um CSV com as colunas Data, Descrição e Valor. As transações entram como pendentes para conferência.</small></div><label className="solid-small file-input">Selecionar CSV<input type="file" accept=".csv,text/csv" onChange={importStatement} /></label></div><div className="reconciliation-list">{items.map((item) => <article className="bank-row" key={item.id}><div className={`direction ${item.direction === 'Crédito' ? 'credit' : 'debit'}`}>{item.direction === 'Crédito' ? '↓' : '↑'}</div><div className="bank-main"><b>{item.description}</b><small>{item.date} · {item.direction}</small></div><div className="suggestion">{item.suggestion ? <><small>Sugestão</small><b>{item.suggestion}</b></> : <span className="badge pendente">Sem sugestão</span>}</div><div className="right"><b>{money(item.amount)}</b><span className={`badge ${statusClass(item.state)}`}>{item.state}</span></div><div className="bank-actions">{item.state === 'Sugerida' && <button className="solid-small" onClick={() => confirm(item.id)}>Confirmar</button>}<button className="plain-small" onClick={() => edit(item)}>Editar</button></div></article>)}</div></section></>; }

function Expenses({ items, maintenances, openForm, edit, cancel, form }) {
  const [filters, setFilters] = useState({ start: '', end: '', category: '' });
  const filtered = items.filter((item) => inRange(dateToIso(item.date), filters.start, filters.end) && (!filters.category || item.category === filters.category));
  const maintenanceName = (item) => maintenances.find((maintenance) => String(maintenance.id) === String(item.maintenanceId))?.title || 'Não vinculada';
  const total = filtered.filter((item) => item.status !== 'Cancelada').reduce((sum, item) => sum + item.amount, 0);
  const filtersView = <FilterBar filters={filters} setFilters={setFilters} categories={items.map((item) => item.category)} />;
  return <>{form}<section className="card expenses-screen"><div className="card-title expenses-title"><div><p className="eyebrow">PAGAMENTOS E MANUTENÇÃO</p><h2>Despesas</h2><small>Controle de contas, pagamentos e custos vinculados às manutenções.</small></div><button className="solid-small" onClick={openForm}>Lançar despesa</button></div><div className="expense-summary"><span><small>Despesas encontradas</small><b>{filtered.length}</b></span><span><small>Total não cancelado</small><b>{money(total)}</b></span></div><div className="expense-filters-desktop">{filtersView}</div><details className="expense-filters-mobile"><summary>Filtrar despesas</summary>{filtersView}</details><p className="filter-result">{filtered.length ? 'Selecione uma despesa para editar ou cancelar.' : 'Nenhuma despesa encontrada com os filtros aplicados.'}</p><div className="expense-mobile-list">{filtered.map((item) => <article className="expense-mobile-card" key={item.id}><div className="expense-mobile-top"><div><p className="eyebrow">{item.unit || 'Área comum'}</p><h3>{item.description}</h3></div><strong>{money(item.amount)}</strong></div><div className="expense-mobile-status"><span className={`badge ${statusClass(item.status)}`}>{item.status}</span><span>{item.category || 'Sem categoria'}</span></div><dl className="expense-mobile-details"><div><dt>Fornecedor</dt><dd>{item.supplier || 'Não informado'}</dd></div><div><dt>Vencimento</dt><dd>{item.dueDate || 'Não informado'}</dd></div><div><dt>Pagamento</dt><dd>{item.paidAt || 'Em aberto'}</dd></div><div><dt>Manutenção</dt><dd>{maintenanceName(item)}</dd></div></dl><div className="expense-mobile-actions"><button className="table-action" onClick={() => edit(item)}>Editar</button>{item.status !== 'Cancelada' && <button className="plain-small" onClick={() => cancel(item)}>Cancelar</button>}</div></article>)}</div><div className="expense-table-desktop"><Table headers={['Inclusão', 'Vencimento', 'Pagamento', 'Descrição', 'Fornecedor', 'Manutenção', 'Referência', 'Categoria', 'Valor', 'Situação', 'Ações']} rows={filtered.map((item) => [item.date, item.dueDate || 'Não informado', item.paidAt || 'Em aberto', item.description, item.supplier, maintenanceName(item), item.unit, item.category, money(item.amount), <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>, <span className="row-actions"><button className="table-action" onClick={() => edit(item)}>Editar</button>{item.status !== 'Cancelada' && <button className="plain-small" onClick={() => cancel(item)}>Cancelar</button>}</span>])} /></div></section></>;
}

function Maintenances({ items, expenses, openForm, edit, showReport, form }) { const expenseTotal = (maintenance) => expenses.filter((item) => String(item.maintenanceId) === String(maintenance.id)).reduce((total, item) => total + item.amount, 0); return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">OPERAÇÃO DO PRÉDIO</p><h2>Manutenções</h2><small>Registre o chamado; os valores são lançados nas despesas vinculadas.</small></div><button className="solid-small" onClick={openForm}>Nova manutenção</button></div><Table headers={['Abertura', 'Solicitação', 'Referência', 'Prioridade', 'Fornecedor', 'Despesas vinculadas', 'Situação', 'Ações']} rows={items.map((item) => [item.openedAt, item.title, item.unit, <span className={`badge priority-${statusClass(item.priority)}`}>{item.priority}</span>, item.supplier, money(expenseTotal(item)), <span className={`badge maintenance-${statusClass(item.status)}`}>{item.status}</span>, <span className="row-actions"><button className="table-action" onClick={() => showReport(item)}>Relatório</button><button className="plain-small" onClick={() => edit(item)}>Editar</button></span>])} /></section></>; }

function MaintenanceDetailReport({ maintenance, expenses, onClose }) { const total = expenses.filter((item) => item.status !== 'Cancelada').reduce((sum, item) => sum + item.amount, 0); return <Modal title={`Relatório · ${maintenance.title}`} onClose={onClose}><div className="profile-details"><div className="profile-contact"><span><b>Unidade</b>{maintenance.unit}</span><span><b>Situação</b>{maintenance.status}</span><span><b>Abertura</b>{maintenance.openedAt}</span><span><b>Total das despesas</b>{money(total)}</span></div>{maintenance.observations && <div className="maintenance-observations"><p className="eyebrow">OBSERVAÇÕES</p><p>{maintenance.observations}</p></div>}<div><p className="eyebrow">DESPESAS VINCULADAS</p>{expenses.length ? <Table headers={['Inclusão', 'Vencimento', 'Descrição', 'Fornecedor', 'Pagamento', 'Situação', 'Valor']} rows={expenses.map((item) => [item.date, item.dueDate || '—', item.description, item.supplier, item.paidAt || 'Em aberto', item.status, money(item.amount)])} /> : <p className="muted">Nenhuma despesa foi vinculada a esta manutenção.</p>}</div></div></Modal>; }

function Terminations({ items, charges, cancel, openForm, edit, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">ENCERRAMENTO DE CONTRATOS</p><h2>Distratos</h2><small>O distrato encerra o contrato, cancela cobranças futuras em aberto e cria a cobrança da multa rescisória.</small></div><button className="solid-small" onClick={openForm}>Novo distrato</button></div><Table headers={['Inquilino', 'Unidade', 'Data do distrato', 'Vencimento da multa', 'Término original', 'Multa final', 'Situação', 'Ação']} rows={items.map((item) => [item.tenant, item.unit, item.terminationDate, item.penaltyDue || item.terminationDate, item.originalEnd, money(item.finalPenalty), <span className={`badge ${statusClass(item.status || 'Ativo')}`}>{item.status || 'Ativo'}</span>, <span className="row-actions">{item.status !== 'Cancelado' && <button className="table-action" onClick={() => edit(item)}>Editar distrato</button>}{item.status !== 'Cancelado' && <button className="plain-small" onClick={() => cancel(item)} disabled={charges.some((charge) => charge.contractId === item.contractId && charge.type === 'Multa rescisória' && charge.status === 'Pago')}>Cancelar distrato</button>}</span>])} /></section></>; }

function Registrations({ tenants, contracts, suppliers, categories, users, accessProfiles, isAdministrator, openForm, form, profile, closeProfile, openProfile }) {
  const [section, setSection] = useState('tenant');
  const label = (item) => item.parentId ? `${categories.find((parent) => parent.id === Number(item.parentId))?.name || 'Categoria'} › ${item.name}` : item.name;
  const body = section === 'tenant' ? <><div className="card-title"><div><p className="eyebrow">PESSOAS</p><h2>Inquilinos</h2></div><button className="solid-small" onClick={() => openForm('tenant')}>Novo inquilino</button></div><Table headers={['Nome', 'CPF', 'Telefone', 'Situação', 'Ações']} rows={tenants.map((item) => [item.name, item.cpf || 'Não informado', item.phone || 'Não informado', <span className="badge pago">{item.status}</span>, <span className="row-actions"><button className="table-action" onClick={() => openProfile(item)}>Ver cadastro</button><button className="plain-small" onClick={() => openForm('tenant', item)}>Editar</button></span>])} /></> : section === 'supplier' ? <><div className="card-title"><div><p className="eyebrow">PARCEIROS</p><h2>Fornecedores</h2></div><button className="solid-small" onClick={() => openForm('supplier')}>Novo fornecedor</button></div><Table headers={['Nome', 'Categoria', 'Telefone', 'Situação', 'Ação']} rows={suppliers.map((item) => [item.name, item.category || 'Não informada', item.phone || 'Não informado', <span className="badge pago">{item.status}</span>, <button className="table-action" onClick={() => openForm('supplier', item)}>Editar</button>])} /></> : section === 'category' ? <><div className="card-title"><div><p className="eyebrow">FINANCEIRO</p><h2>Categorias e subcategorias</h2></div><button className="solid-small" onClick={() => openForm('category')}>Nova categoria</button></div><Table headers={['Categoria', 'Descrição', 'Situação', 'Ação']} rows={categories.map((item) => [label(item), item.description || 'Sem descrição', <span className="badge pago">{item.status}</span>, <button className="table-action" onClick={() => openForm('category', item)}>Editar</button>])} /></> : section === 'access' ? <><div className="card-title"><div><p className="eyebrow">SEGURANÇA</p><h2>Níveis de acesso</h2><small>Defina as telas que cada perfil poderá utilizar.</small></div><button className="solid-small" onClick={() => openForm('accessProfile')}>Novo nível</button></div><Table headers={['Nível', 'Telas liberadas', 'Situação', 'Ação']} rows={Object.entries(accessProfiles).map(([name, item]) => [name, `${item.pages.length} tela(s)`, <span className="badge pago">{item.status || 'Ativo'}</span>, <button className="table-action" onClick={() => openForm('accessProfile', { ...item, name })}>Editar nível</button>])} /></> : <><div className="card-title"><div><p className="eyebrow">SEGURANÇA</p><h2>Usuários</h2><small>Cadastre, altere senha, defina o nível de acesso ou desative o acesso.</small></div><button className="solid-small" onClick={() => openForm('user')}>Novo usuário</button></div><Table headers={['Nome', 'E-mail', 'Perfil', 'Situação', 'Ação']} rows={users.map((item) => [item.name, item.email, item.role, <span className="badge pago">{item.status}</span>, <button className="table-action" onClick={() => openForm('user', item)}>Editar acesso</button>])} /></>;
  return <>{form}{profile && <TenantProfile tenant={profile} contracts={contracts.filter((item) => item.tenant === profile.name)} onClose={closeProfile} />}<section className="card"><div className="subnav"><button className={section === 'tenant' ? 'active' : ''} onClick={() => setSection('tenant')}>Inquilinos</button><button className={section === 'supplier' ? 'active' : ''} onClick={() => setSection('supplier')}>Fornecedores</button><button className={section === 'category' ? 'active' : ''} onClick={() => setSection('category')}>Categorias de despesas</button>{isAdministrator && <><button className={section === 'user' ? 'active' : ''} onClick={() => setSection('user')}>Usuários</button><button className={section === 'access' ? 'active' : ''} onClick={() => setSection('access')}>Níveis de acesso</button></>}</div>{body}</section></>;
}

function AttachmentList({ attachments = [] }) { return attachments.length ? <div className="attachment-list">{attachments.map((attachment) => <a key={attachment.id || attachment.name} href={attachment.dataUrl} download={attachment.name} target="_blank" rel="noreferrer">{attachment.name}</a>)}</div> : <p className="muted">Nenhum anexo arquivado.</p>; }
function TenantProfile({ tenant, contracts, onClose }) { return <Modal title={`Cadastro de ${tenant.name}`} onClose={onClose}><div className="profile-details"><div className="profile-contact"><span><b>CPF</b>{tenant.cpf || 'Não informado'}</span><span><b>Telefone</b>{tenant.phone || 'Não informado'}</span><span><b>E-mail</b>{tenant.email || 'Não informado'}</span><span><b>Situação</b>{tenant.status}</span></div>{tenant.observations && <div className="maintenance-observations"><p className="eyebrow">OBSERVAÇÕES</p><p>{tenant.observations}</p></div>}<div><p className="eyebrow">DOCUMENTAÇÃO DO INQUILINO</p><AttachmentList attachments={tenant.attachments} /></div><div><p className="eyebrow">HISTÓRICO CONTRATUAL</p><h3>Contratos e anexos</h3>{contracts.length ? <div className="profile-contracts">{contracts.map((contract) => <article key={contract.id}><b>{contract.unit}</b><small>{contract.start} até {contract.end} · vencimento dia {contract.dueDay || parseBrDate(contract.start).getDate()}</small><small>Multa contratual: {Number(contract.penaltyMultiplier) || 0} × aluguel</small><span>{contract.attachmentName ? `Anexo: ${contract.attachmentName}` : 'Sem anexo cadastrado'}</span>{contract.terminationDate && <em>Distratado em {contract.terminationDate}</em>}</article>)}</div> : <p className="muted">Não há contratos vinculados a este cadastro.</p>}</div></div></Modal>; }

function Backups({ points, createPoint, restorePoint, exportBackup, importBackup }) {
  const restore = (point) => restorePoint(point);
  return <><section className="card backup-hero"><div><p className="eyebrow">SEGURANÇA DOS DADOS</p><h2>Backups e pontos de restauração</h2><p>Crie uma cópia antes de testar alterações, restaure um estado anterior quando necessário ou baixe e importe um backup completo do sistema.</p></div><div className="backup-actions"><button className="solid-small" onClick={() => createPoint()}>Criar ponto de restauração</button><button className="plain-small" onClick={exportBackup}>Exportar backup geral</button><label className="plain-small file-input">Importar backup<input type="file" accept="application/json,.json" onChange={importBackup} /></label></div></section><section className="card"><div className="card-title"><div><p className="eyebrow">HISTÓRICO COMPARTILHADO</p><h2>Pontos de restauração</h2></div><span className="muted">Até 30 pontos são mantidos para os usuários do sistema.</span></div>{points.length ? <Table headers={['Nome', 'Criado em', 'Dados salvos', 'Ação']} rows={points.map((point) => [point.name, timestampLabel(point.createdAt), `${point.data?.charges?.length || 0} cobranças · ${point.data?.expenses?.length || 0} despesas · ${point.data?.contracts?.length || 0} contratos`, <button className="table-action" onClick={() => restore(point)}>Restaurar este ponto</button>])} /> : <p className="muted">Ainda não há pontos de restauração criados.</p>}</section></>;
}

function Reports({ charges, expenses, suppliers, maintenances, units }) {
  const [selected, setSelected] = useState('');
  const [filters, setFilters] = useState({ start: '', end: '', tenant: '', category: '', unit: '', supplier: '' });
  const filteredCharges = charges.filter((item) => inRange(dateToIso(item.paidAt || item.due), filters.start, filters.end) && (!filters.tenant || item.tenant === filters.tenant) && (!filters.unit || item.unit === filters.unit));
  const filteredExpenses = expenses.filter((item) => item.status !== 'Cancelada' && inRange(dateToIso(item.date), filters.start, filters.end) && (!filters.category || item.category === filters.category) && (!filters.unit || item.unit === filters.unit) && (!filters.supplier || item.supplier === filters.supplier));
  const filteredMaintenances = maintenances.filter((item) => inRange(dateToIso(item.openedAt), filters.start, filters.end) && (!filters.unit || item.unit === filters.unit));
  const received = (unit) => filteredCharges.filter((item) => item.type !== 'Caução' && item.status !== 'Cancelada' && (!unit || item.unit === unit)).reduce((total, item) => total + (item.receivedAmount ?? (item.status === 'Pago' ? item.amount : 0)), 0);
  const expense = (unit) => filteredExpenses.filter((item) => !unit || item.unit === unit).reduce((total, item) => total + item.amount, 0);
  const income = received(); const expenseTotal = expense(); const openTotal = filteredCharges.filter(isOpenCharge).reduce((total, item) => total + item.amount, 0);
  const deposits = filteredCharges.filter((item) => item.type === 'Caução' && item.status !== 'Cancelada');
  const depositAmount = (item) => item.receivedAmount ?? (item.status === 'Pago' ? item.amount : 0);
  const depositsInPossession = deposits.filter((item) => item.status === 'Pago' && depositSituation(item) === 'Em posse').reduce((total, item) => total + depositAmount(item), 0);
  const depositsOpen = deposits.filter(isOpenCharge).reduce((total, item) => total + item.amount, 0);
  const depositsReturned = deposits.filter((item) => depositSituation(item) === 'Devolvida ao inquilino').reduce((total, item) => total + depositAmount(item), 0);
  const depositsUsed = deposits.filter((item) => ['Utilizada em reparos', 'Compensada com débito'].includes(depositSituation(item))).reduce((total, item) => total + depositAmount(item), 0);
  const unitRows = units.filter((item) => item.rent).map((item) => [item.name, received(item.name), expense(item.name), received(item.name) - expense(item.name)]);
  const expenseUnits = [...new Set(filteredExpenses.map((item) => item.unit))].map((unit) => [unit, filteredExpenses.filter((item) => item.unit === unit).length, expense(unit)]);
  const supplierRows = [...new Set(filteredExpenses.map((item) => item.supplier))].map((supplier) => [supplier, filteredExpenses.filter((item) => item.supplier === supplier).length, filteredExpenses.filter((item) => item.supplier === supplier).reduce((sum, item) => sum + item.amount, 0)]);
  const maintenanceRows = [...new Set(filteredMaintenances.map((item) => item.unit))].map((unit) => { const items = filteredMaintenances.filter((item) => item.unit === unit); const ids = new Set(items.map((item) => String(item.id))); return [unit, items.length, items.filter((item) => item.status === 'Concluída').length, items.filter((item) => !['Concluída', 'Cancelada'].includes(item.status)).length, filteredExpenses.filter((item) => ids.has(String(item.maintenanceId))).reduce((sum, item) => sum + item.amount, 0)]; });
  const maintenanceExpenseRows = filteredExpenses.filter((item) => item.maintenanceId).map((item) => { const maintenance = maintenances.find((record) => String(record.id) === String(item.maintenanceId)); return [maintenance?.unit || item.unit, maintenance?.title || 'Manutenção não encontrada', maintenance?.status || '—', item.date, item.dueDate || '—', item.description, item.supplier, item.paidAt || 'Em aberto', money(item.amount)]; });
  const catalog = [{ id: 'result', category: 'Financeiro', title: 'Resultado por unidade' }, { id: 'receipts', category: 'Financeiro', title: 'Recebimentos por unidade' }, { id: 'deposits', category: 'Garantias', title: 'Cauções em posse' }, { id: 'expense-unit', category: 'Despesas', title: 'Pagamentos por unidade' }, { id: 'supplier', category: 'Despesas', title: 'Pagamentos por fornecedor' }, { id: 'maintenance', category: 'Operação', title: 'Manutenções por unidade' }, { id: 'open', category: 'Cobranças', title: 'Valores em aberto' }];
  if (!selected) return <section className="card"><div className="card-title"><div><p className="eyebrow">CENTRAL DE RELATÓRIOS</p><h2>Escolha um relatório</h2><small>Os relatórios são organizados por categoria e possuem filtros próprios.</small></div></div><div className="report-catalog">{catalog.map((item) => <button key={item.id} className="report-option" onClick={() => setSelected(item.id)}><span>{item.category}</span><b>{item.title}</b><small>Abrir relatório</small></button>)}</div></section>;
  const title = catalog.find((item) => item.id === selected)?.title;
  const content = selected === 'result' ? <Table headers={['Unidade', 'Recebido', 'Despesas', 'Resultado']} rows={unitRows.map((row) => [row[0], money(row[1]), money(row[2]), money(row[3])])} /> : selected === 'receipts' ? <Table headers={['Unidade', 'Recebido']} rows={unitRows.map((row) => [row[0], money(row[1])])} /> : selected === 'deposits' ? <Table headers={['Unidade', 'Inquilino', 'Vencimento', 'Recebida em', 'Valor', 'Situação', 'Movimentação', 'Observações']} rows={deposits.map((item) => [item.unit, item.tenant, item.due, item.paidAt || 'A receber', money(item.amount), depositSituation(item), item.depositProcessedAt || '—', item.depositNote || '—'])} /> : selected === 'expense-unit' ? <Table headers={['Unidade', 'Lançamentos', 'Valor']} rows={expenseUnits.map((row) => [row[0], row[1], money(row[2])])} /> : selected === 'supplier' ? <Table headers={['Fornecedor', 'Lançamentos', 'Valor']} rows={supplierRows.map((row) => [row[0], row[1], money(row[2])])} /> : selected === 'maintenance' ? <><Table headers={['Unidade', 'Total', 'Concluídas', 'Em aberto', 'Despesas vinculadas']} rows={maintenanceRows.map((row) => [row[0], row[1], row[2], row[3], money(row[4])])} /><div className="report-detail-title"><p className="eyebrow">DETALHAMENTO</p><h3>Despesas de manutenção</h3></div><Table headers={['Unidade', 'Manutenção', 'Situação', 'Inclusão', 'Vencimento', 'Despesa', 'Fornecedor', 'Pagamento', 'Valor']} rows={maintenanceExpenseRows} /></> : <Table headers={['Unidade', 'Inquilino', 'Vencimento', 'Tipo', 'Valor']} rows={filteredCharges.filter(isOpenCharge).map((item) => [item.unit, item.tenant, item.due, item.type || 'Aluguel', money(item.amount)])} />;
  const metrics = selected === 'deposits' ? [{ label: 'Em posse', value: money(depositsInPossession), hint: 'Valores recebidos sob guarda', tone: 'purple' }, { label: 'A receber', value: money(depositsOpen), hint: 'Cauções ainda em aberto', tone: 'orange' }, { label: 'Devolvidas', value: money(depositsReturned), hint: 'No período filtrado', tone: 'green' }, { label: 'Utilizadas ou compensadas', value: money(depositsUsed), hint: 'Com baixa registrada', tone: 'blue' }] : [{ label: 'Recebido', value: money(income), hint: 'No período filtrado', tone: 'green' }, { label: 'Despesas', value: money(expenseTotal), hint: 'No período filtrado', tone: 'orange' }, { label: 'Resultado', value: money(income - expenseTotal), hint: 'Base caixa', tone: 'blue' }, { label: 'Em aberto', value: money(openTotal), hint: `${filteredCharges.filter(isOpenCharge).length} cobrança(s)`, tone: 'purple' }];
  return <><section className="card report-filter"><div className="card-title"><div><p className="eyebrow">RELATÓRIO</p><h2>{title}</h2></div><button className="plain-small" onClick={() => setSelected('')}>Todos os relatórios</button></div><FilterBar filters={filters} setFilters={setFilters} tenants={charges.map((item) => item.tenant)} categories={expenses.map((item) => item.category)} units={units.map((item) => item.name)} suppliers={suppliers.map((item) => item.name)} /></section><section className="metric-grid">{metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</section><section className="card"><div className="card-title"><div><p className="eyebrow">DADOS FILTRADOS</p><h2>{title}</h2></div></div>{content}</section></>;
}

function FilterBar({ filters, setFilters, tenants = [], categories = [], units = [], suppliers = [] }) {
  const update = (key, value) => setFilters({ ...filters, [key]: value });
  const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  return <div className="filter-bar"><label>De<input type="date" value={filters.start} onChange={(event) => update('start', event.target.value)} /></label><label>Até<input type="date" value={filters.end} onChange={(event) => update('end', event.target.value)} /></label>{units.length > 0 && <label>Unidade<select value={filters.unit || ''} onChange={(event) => update('unit', event.target.value)}><option value="">Todas</option>{unique(units).map((unit) => <option key={unit}>{unit}</option>)}</select></label>}{tenants.length > 0 && <label>Inquilino<select value={filters.tenant || ''} onChange={(event) => update('tenant', event.target.value)}><option value="">Todos</option>{unique(tenants).map((tenant) => <option key={tenant}>{tenant}</option>)}</select></label>}{categories.length > 0 && <label>Categoria<select value={filters.category || ''} onChange={(event) => update('category', event.target.value)}><option value="">Todas</option>{unique(categories).map((category) => <option key={category}>{category}</option>)}</select></label>}{suppliers.length > 0 && <label>Fornecedor<select value={filters.supplier || ''} onChange={(event) => update('supplier', event.target.value)}><option value="">Todos</option>{unique(suppliers).map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>}<button className="clear-filter" type="button" onClick={() => setFilters({ start: '', end: '', tenant: '', category: '', unit: '', supplier: '' })}>Limpar filtros</button></div>;
}

function Table({ headers, rows }) { return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td data-label={headers[cellIndex]} key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>; }

function Modal({ title, children, onClose }) { return <div className="modal-backdrop"><section className="modal"><div className="modal-head"><h2>{title}</h2><button onClick={onClose}>×</button></div>{children}</section></div>; }
function CurrencyInput({ name, defaultValue = 0, value, onValueChange, readOnly = false }) { const [display, setDisplay] = useState(money(value ?? defaultValue)); useEffect(() => { if (value !== undefined) setDisplay(money(value)); }, [value]); const change = (event) => { const next = currencyValue(event.target.value); setDisplay(money(next)); onValueChange?.(next); }; return <input name={name} type="text" inputMode="numeric" value={display} readOnly={readOnly} onChange={change} aria-label={name} />; }
function ChargeForm({ record, units, onClose, onSubmit }) { return <Modal title={record ? 'Editar cobrança' : 'Nova cobrança'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Unidade<select name="unit" required defaultValue={record?.unit}>{units.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Inquilino<input name="tenant" required defaultValue={record?.tenant} placeholder="Nome do inquilino" /></label><label>Vencimento<input name="due" required type="date" defaultValue={dateFieldValue(record?.due, dateInputValue())} /></label><label>Valor<CurrencyInput name="amount" defaultValue={record?.amount || 0} /></label><label>Situação<select name="status" defaultValue={record?.status || 'Em aberto'}><option>Em aberto</option><option>Pago</option><option>Parcial</option><option>Cancelada</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Fechar</button><button className="solid-small">Salvar cobrança</button></div></form></Modal>; }
function ReceiptForm({ charge, onClose, onSubmit }) {
  const received = charge.receivedAmount || 0;
  const settled = charge.settledAmount ?? received;
  const remaining = Math.max(0, charge.amount - settled);
  const [paymentAmount, setPaymentAmount] = useState(remaining);
  const [adjustmentType, setAdjustmentType] = useState('');
  const difference = Math.abs(Number(paymentAmount || 0) - remaining);
  return <Modal title={`Recebimento · ${charge.unit}`} onClose={onClose}><form onSubmit={(event) => onSubmit(event, charge)} className="form-grid"><div className="termination-summary"><b>{charge.tenant} · vencimento {charge.due}</b><span>Cobrança: {money(charge.amount)} · já recebido: {money(received)}</span><strong>Saldo: {money(remaining)}</strong></div><label>Valor do pagamento<CurrencyInput name="amount" value={paymentAmount} onValueChange={(value) => { setPaymentAmount(value); setAdjustmentType(''); }} /></label><label>Data do recebimento<input name="receivedOn" required type="date" defaultValue={dateInputValue()} /></label>{difference > 0.001 ? <><label className="full">Motivo da diferença<select name="adjustmentType" required value={adjustmentType} onChange={(event) => setAdjustmentType(event.target.value)}><option value="" disabled>Selecione o ajuste aplicado</option>{paymentAmount < remaining ? <><option value="discount">Desconto concedido</option><option value="partial">Pagamento parcial (gerar nova fatura)</option></> : <option value="penaltyInterest">Multa e juros aplicados</option>}</select></label><div className="adjustment-note">Diferença apurada: <b>{money(difference)}</b>{paymentAmount < remaining ? ' — será registrada como desconto ou saldo parcial.' : ' — será registrada como multa e juros.'}</div>{adjustmentType === 'partial' && <label className="full">Vencimento da nova fatura<input name="newInvoiceDue" required type="date" defaultValue={dateInputValue()} /></label>}{adjustmentType === 'penaltyInterest' && <><label>Valor extra<CurrencyInput name="extraAmount" value={difference} readOnly /></label><label>Referência do valor extra<input name="extraReference" required placeholder="Ex.: multa por atraso de setembro" /></label></>}</> : <input type="hidden" name="adjustmentType" value="none" />}<label className="full">Informações do pagamento<textarea name="information" required placeholder="Ex.: PIX Banco Inter, identificador da transação ou observação" /></label><p className="form-note">No pagamento parcial, a cobrança atual fica encerrada e é criada uma nova fatura com o saldo restante.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Confirmar recebimento</button></div></form></Modal>;
}
function DepositManagementForm({ charge, onClose, onSubmit }) {
  const [status, setStatus] = useState(charge.depositStatus || 'Em posse');
  const needsDate = status !== 'Em posse';
  return <Modal title={`Gerenciar caução · ${charge.unit}`} onClose={onClose}><form onSubmit={(event) => onSubmit(event, charge)} className="form-grid"><div className="termination-summary"><b>{charge.tenant}</b><span>Recebida em {charge.paidAt || '—'} · valor {money(charge.receivedAmount ?? charge.amount)}</span><strong>{depositSituation(charge)}</strong></div><label className="full">Situação da caução<select name="depositStatus" value={status} onChange={(event) => setStatus(event.target.value)}><option>Em posse</option><option>Devolvida ao inquilino</option><option>Utilizada em reparos</option><option>Compensada com débito</option></select><small>A caução não é receita de aluguel. Registre aqui o destino dado a ela ao encerrar o contrato.</small></label>{needsDate && <label>Data da movimentação<input name="processedAt" required type="date" defaultValue={dateFieldValue(charge.depositProcessedAt, dateInputValue())} /></label>}<label className="full">Observações<textarea name="depositNote" defaultValue={charge.depositNote} placeholder="Ex.: devolvida via PIX; compensada com reparos descritos na vistoria final." /></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar situação</button></div></form></Modal>;
}
function ExpenseForm({ categories, suppliers, maintenances, units, record, onClose, onSubmit }) { const optionLabel = (item) => item.parentId ? `${categories.find((parent) => parent.id === Number(item.parentId))?.name || 'Categoria'} › ${item.name}` : item.name; return <Modal title={record ? 'Editar despesa' : 'Lançar despesa'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Data de inclusão<input name="includedAt" required type="date" defaultValue={record?.date ? dateToIso(record.date) : dateInputValue()} /></label><label>Vencimento<input name="dueDate" required type="date" defaultValue={record?.dueDate ? dateToIso(record.dueDate) : dateInputValue()} /></label><label>Data de pagamento<input name="paidAt" type="date" defaultValue={record?.paidAt ? dateToIso(record.paidAt) : ''} /><small>Preencha quando a despesa for paga.</small></label><label>Valor<CurrencyInput name="amount" defaultValue={record?.amount || 0} /></label><label className="full">Descrição<input name="description" required defaultValue={record?.description} placeholder="O que foi pago?" /></label><label>Fornecedor<select name="supplier" required defaultValue={record?.supplier || ''}><option value="">Selecione</option>{suppliers.filter((item) => item.status === 'Ativo' || item.name === record?.supplier).map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label>Referência<select name="unit" defaultValue={record?.unit || 'Área comum'}><option>Área comum</option>{units.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label className="full">Vincular à manutenção<select name="maintenanceId" defaultValue={record?.maintenanceId || ''}><option value="">Sem manutenção vinculada</option>{maintenances.filter((item) => !['Concluída', 'Cancelada'].includes(item.status) || String(item.id) === String(record?.maintenanceId)).map((item) => <option key={item.id} value={item.id}>{item.unit} · {item.title} · {item.status}</option>)}</select><small>Somente manutenções ainda não concluídas podem receber novas despesas.</small></label><label>Categoria<select name="category" defaultValue={record?.category}>{categories.filter((item) => item.status === 'Ativa').map((item) => <option key={item.id} value={optionLabel(item)}>{optionLabel(item)}</option>)}</select></label><label>Situação<select name="status" defaultValue={record?.status || 'Pendente'}><option>Pendente</option><option>Conciliada</option><option>Paga</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar despesa</button></div></form></Modal>; }
function ContractForm({ tenants, units, record, onClose, onSubmit }) { const defaultDueDay = record?.dueDay || (record?.start ? parseBrDate(record.start).getDate() : 5); return <Modal title={record ? 'Editar contrato' : 'Novo contrato'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Unidade<select name="unit" required defaultValue={record?.unit}>{units.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Inquilino titular<select name="tenant" required defaultValue={record?.tenant || ''}><option value="">Selecione</option>{tenants.filter((item) => item.status === 'Ativo').map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label>Início do contrato<input name="start" required type="date" defaultValue={dateFieldValue(record?.start, dateInputValue())} /></label><label>Fim do contrato<input name="end" required type="date" defaultValue={dateFieldValue(record?.end, dateInputValue())} /></label><label>Dia de vencimento da fatura<input name="dueDay" required type="number" min="1" max="31" defaultValue={defaultDueDay} /><small>O primeiro aluguel será no primeiro vencimento após 30 dias do início.</small></label><label>Aluguel mensal<CurrencyInput name="rent" defaultValue={record?.rent || 0} /></label><label>Valor da caução<CurrencyInput name="depositAmount" defaultValue={record?.depositAmount || 0} /><small>A cobrança é criada automaticamente ao salvar.</small></label><label>Vencimento da caução<input name="depositDue" type="date" defaultValue={dateFieldValue(record?.depositDue, record?.start ? dateFieldValue(record.start) : dateInputValue())} /></label><label>Multiplicador da multa<input name="penaltyMultiplier" required type="number" min="0" step="0.01" defaultValue={record?.penaltyMultiplier ?? 0} /><small>Ex.: 3 para três aluguéis.</small></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativo'}><option>Ativo</option><option>Encerrado</option><option>Cancelado</option></select></label><label className="full">Contrato de aluguel (anexo)<input name="attachment" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />{record?.attachmentName && <small>Anexo atual: {record.attachmentName}</small>}</label><label className="full">Vistoria inicial do imóvel<input name="inspectionAttachments" type="file" multiple accept="image/*,.pdf,.doc,.docx" /><small>Anexe laudo, fotos e documentos da vistoria. Até 8 arquivos no total, com até 1 MB cada.</small></label>{record?.inspectionAttachments?.length ? <div className="full"><p className="eyebrow">VISTORIAS JÁ ARQUIVADAS</p><AttachmentList attachments={record.inspectionAttachments} /></div> : null}<p className="form-note">O primeiro aluguel só será gerado após 30 dias de contrato. A caução aparece em Cobranças e recebe baixa pelo mesmo fluxo de recebimento.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar contrato</button></div></form></Modal>; }

function TerminationForm({ contracts, record, onClose, onSubmit }) {
  const availableContracts = contracts.filter((item) => item.status === 'Ativo' || item.id === record?.contractId);
  const initialContractId = String(record?.contractId || availableContracts[0]?.id || '');
  const [contractId, setContractId] = useState(initialContractId);
  const [terminationDate, setTerminationDate] = useState(record?.terminationDate ? dateToIso(record.terminationDate) : dateInputValue());
  const [penaltyDue, setPenaltyDue] = useState(record?.penaltyDue ? dateToIso(record.penaltyDue) : dateInputValue());
  const contract = contracts.find((item) => String(item.id) === contractId);
  const calculation = terminationCalculation(contract, terminationDate);
  const [finalPenalty, setFinalPenalty] = useState(record?.finalPenalty ?? calculation.calculatedPenalty);
  const [preserveStoredPenalty, setPreserveStoredPenalty] = useState(Boolean(record));
  useEffect(() => {
    if (preserveStoredPenalty) {
      setPreserveStoredPenalty(false);
      return;
    }
    setFinalPenalty(calculation.calculatedPenalty);
  }, [contractId, terminationDate, preserveStoredPenalty, calculation.calculatedPenalty]);
  return <Modal title={record ? 'Editar distrato e multa' : 'Novo distrato'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label className="full">Contrato<select name="contractId" required value={contractId} onChange={(event) => setContractId(event.target.value)}><option value="">Selecione</option>{availableContracts.map((item) => <option key={item.id} value={item.id}>{item.unit} · {item.tenant} · até {item.end}</option>)}</select></label><label>Data do distrato<input name="terminationDate" type="date" required value={terminationDate} onChange={(event) => setTerminationDate(event.target.value)} /></label><label>Vencimento da multa<input name="penaltyDue" type="date" required value={penaltyDue} onChange={(event) => setPenaltyDue(event.target.value)} /></label><label>Multa final (editável)<CurrencyInput name="finalPenalty" value={finalPenalty} onValueChange={setFinalPenalty} /></label><div className="termination-summary"><b>Cálculo proporcional</b><span>{calculation.remainingDays} dias restantes de {calculation.totalDays} dias</span><strong>{money(calculation.calculatedPenalty)}</strong><small>{Number(contract?.penaltyMultiplier) || 0} × {money(Number(contract?.rent) || 0)} × período restante</small></div><label className="full">Motivo do distrato<textarea name="reason" required defaultValue={record?.reason} placeholder="Descreva o motivo e eventuais acordos" /></label><label className="full">Observações complementares<textarea name="observations" defaultValue={record?.observations} placeholder="Acrescente documentos pendentes, condições negociadas ou demais informações relevantes." /></label><p className="form-note">Você pode reabrir qualquer distrato ativo pelo botão “Editar distrato” para complementar ou corrigir informações.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">{record ? 'Salvar ajustes' : 'Registrar distrato'}</button></div></form></Modal>;
}
function MaintenanceForm({ record, units, onClose, onSubmit }) { return <Modal title={record ? 'Editar manutenção' : 'Nova manutenção'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Data de abertura<input name="openedAt" required type="date" defaultValue={dateFieldValue(record?.openedAt, dateInputValue())} /></label><label>Referência<select name="unit" defaultValue={record?.unit || 'Área comum'}><option>Área comum</option>{units.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label className="full">Solicitação<input name="title" required defaultValue={record?.title} placeholder="Descreva o problema ou serviço" /></label><label>Prioridade<select name="priority" defaultValue={record?.priority || 'Média'}><option>Baixa</option><option>Média</option><option>Alta</option></select></label><label>Situação<select name="status" defaultValue={record?.status || 'Aberta'}><option>Aberta</option><option>Em andamento</option><option>Aguardando fornecedor</option><option>Concluída</option><option>Cancelada</option></select></label><label>Fornecedor ou responsável<input name="supplier" defaultValue={record?.supplier} placeholder="A definir" /></label><label className="full">Observações e detalhes<textarea name="observations" defaultValue={record?.observations} placeholder="Descreva o diagnóstico, materiais necessários, acordos com fornecedor, andamento e demais detalhes da manutenção." /></label><p className="form-note">Os custos são lançados exclusivamente em Despesas e vinculados a esta manutenção enquanto ela estiver aberta.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar manutenção</button></div></form></Modal>; }
function UnitForm({ record, tenants, onClose, onSubmit }) { return <Modal title={`Editar ${record.name}`} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Identificação da unidade<input name="name" required defaultValue={record.name} placeholder="Ex.: Kitnet 01" /></label><label>Situação<select name="status" defaultValue={record.status}><option>Ocupada</option><option>Vaga</option><option>Em manutenção</option><option>Indisponível</option></select></label><label className="full">Inquilino de referência<select name="tenant" defaultValue={record.tenant === '—' ? '' : record.tenant}><option value="">Sem inquilino</option>{tenants.map((tenant) => <option key={tenant.id}>{tenant.name}</option>)}</select></label><label>Valor mensal de referência<CurrencyInput name="rent" defaultValue={record.rent || 0} /></label><label>Número Cagece<input name="cagece" defaultValue={record.cagece} placeholder="Matrícula ou instalação" /></label><label>Número Enel<input name="enel" defaultValue={record.enel} placeholder="UC ou instalação" /></label><label className="full">Identificação do IPTU<input name="iptu" defaultValue={record.iptu} placeholder="Inscrição imobiliária ou número do IPTU" /></label><label className="full">Descrição do imóvel<textarea name="description" defaultValue={record.description} placeholder="Características, mobília, condições de entrega e demais informações da kitnet." /></label><label className="full">Fotos e documentos da unidade<input name="attachments" type="file" multiple accept="image/*,.pdf,.doc,.docx" /><small>Até 8 arquivos no total, com até 1 MB cada. Os novos anexos são acrescentados aos já arquivados.</small></label>{record.attachments?.length ? <div className="full"><p className="eyebrow">ARQUIVOS JÁ ARQUIVADOS</p><AttachmentList attachments={record.attachments} /></div> : null}<p className="form-note">A edição da unidade não altera contratos, cobranças ou históricos já registrados.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar unidade</button></div></form></Modal>; }
function TenantForm({ record, onClose, onSubmit }) { return <Modal title={record ? 'Editar inquilino' : 'Novo inquilino'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label className="full">Nome completo<input name="name" required defaultValue={record?.name} placeholder="Nome do inquilino" /></label><label>CPF<input name="cpf" defaultValue={record?.cpf} placeholder="000.000.000-00" /></label><label>Telefone<input name="phone" defaultValue={record?.phone} placeholder="(00) 00000-0000" /></label><label className="full">E-mail<input name="email" type="email" defaultValue={record?.email} placeholder="nome@exemplo.com" /></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativo'}><option>Ativo</option><option>Inativo</option></select></label><label className="full">Observações<textarea name="observations" defaultValue={record?.observations} placeholder="Registre informações relevantes, acordos, restrições ou observações sobre o inquilino." /></label><label className="full">Documentação do inquilino<input name="attachments" type="file" multiple accept="image/*,.pdf,.doc,.docx" /><small>RG, CPF, comprovantes, fichas e demais documentos. Até 8 arquivos no total, com até 1 MB cada.</small></label>{record?.attachments?.length ? <div className="full"><p className="eyebrow">DOCUMENTOS JÁ ARQUIVADOS</p><AttachmentList attachments={record.attachments} /></div> : null}<div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar inquilino</button></div></form></Modal>; }
function UserForm({ record, accessProfiles, onClose, onSubmit }) { return <Modal title={record ? 'Editar usuário e acesso' : 'Novo usuário'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label className="full">Nome completo<input name="name" required defaultValue={record?.name} placeholder="Nome do usuário" /></label><label>Nome de usuário<input name="username" required defaultValue={record?.username} readOnly={Boolean(record)} placeholder="Ex.: marcio" /><small>Usado no login e não pode ser alterado depois do cadastro.</small></label><label>E-mail para recuperação<input name="email" required type="email" defaultValue={record?.email} placeholder="nome@empresa.com" /></label><label>Perfil de acesso<select name="role" defaultValue={record?.role || 'Consulta'}>{Object.entries(accessProfiles).filter(([name, profile]) => (profile.status || 'Ativo') === 'Ativo' || name === record?.role).map(([name]) => <option key={name}>{name}</option>)}</select></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativo'}><option>Ativo</option><option>Inativo</option></select></label><label className="full">{record ? 'Novo PIN (opcional)' : 'PIN inicial'}<input name="pin" type="password" inputMode="numeric" pattern="[0-9]{6}" required={!record} minLength="6" maxLength="6" placeholder="6 dígitos numéricos" /><small>{record ? 'Deixe vazio para manter o PIN atual.' : 'O PIN é protegido por hash e nunca é exibido.'}</small></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar usuário</button></div></form></Modal>; }
function AccessProfileForm({ record, onClose, onSubmit }) { const selected = new Set(record?.pages || []); const isAdministrator = record?.name === 'Administrador Geral'; return <Modal title={record ? 'Editar nível de acesso' : 'Novo nível de acesso'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label className="full">Nome do nível<input name="name" required defaultValue={record?.name} readOnly={Boolean(record)} placeholder="Ex.: Gestão predial" /><small>{record ? 'O nome não pode ser alterado depois da criação.' : 'Use um nome objetivo para facilitar a seleção no cadastro de usuários.'}</small></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativo'} disabled={isAdministrator}><option>Ativo</option><option>Inativo</option></select></label><div className="full"><p className="eyebrow">TELAS LIBERADAS</p><div className="checkbox-grid">{appPages.map((page) => <label key={page} className="checkbox-option"><input type="checkbox" name="pages" value={page} defaultChecked={isAdministrator || selected.has(page)} disabled={isAdministrator} />{page}</label>)}</div>{isAdministrator && <small>O Administrador Geral mantém acesso completo ao sistema.</small>}</div><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar nível</button></div></form></Modal>; }
function BankAccountForm({ record, onClose, onSubmit }) { return <Modal title={record ? 'Editar conta bancária' : 'Nova conta bancária'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Banco<input name="bank" required defaultValue={record?.bank} placeholder="Nome do banco" /></label><label>Tipo<select name="type" defaultValue={record?.type || 'Conta corrente'}><option>Conta corrente</option><option>Conta pagamento</option><option>Poupança</option></select></label><label className="full">Identificação da conta<input name="account" required defaultValue={record?.account} placeholder="Agência e conta ou apelido" /></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativa'}><option>Ativa</option><option>Inativa</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar conta</button></div></form></Modal>; }
function SupplierForm({ record, onClose, onSubmit }) { return <Modal title={record ? 'Editar fornecedor' : 'Novo fornecedor'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label className="full">Nome ou razão social<input name="name" required defaultValue={record?.name} placeholder="Nome do fornecedor" /></label><label>CPF ou CNPJ<input name="document" defaultValue={record?.document} placeholder="Opcional" /></label><label>Telefone<input name="phone" defaultValue={record?.phone} placeholder="(00) 00000-0000" /></label><label>Categoria principal<input name="category" defaultValue={record?.category} placeholder="Ex.: Hidráulica" /></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativo'}><option>Ativo</option><option>Inativo</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar fornecedor</button></div></form></Modal>; }
function ExpenseCategoryForm({ categories, record, onClose, onSubmit }) { return <Modal title={record ? 'Editar categoria' : 'Nova categoria de despesa'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Nome da categoria<input name="name" required defaultValue={record?.name} placeholder="Ex.: Pintura" /></label><label>Categoria principal<select name="parentId" defaultValue={record?.parentId || ''}><option value="">Esta é uma categoria principal</option>{categories.filter((item) => !item.parentId && item.id !== record?.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="full">Descrição<input name="description" defaultValue={record?.description} placeholder="Quando esta categoria deve ser usada?" /></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativa'}><option>Ativa</option><option>Inativa</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar categoria</button></div></form></Modal>; }
function BankTransactionForm({ record, onClose, onSubmit }) { return <Modal title="Editar transação bancária" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Data<input name="date" required type="date" defaultValue={dateFieldValue(record.date)} /></label><label>Valor<CurrencyInput name="amount" defaultValue={record.amount} /></label><label className="full">Descrição<input name="description" required defaultValue={record.description} /></label><label>Tipo<select name="direction" defaultValue={record.direction}><option>Crédito</option><option>Débito</option></select></label><label>Situação<select name="state" defaultValue={record.state}><option>Pendente</option><option>Sugerida</option><option>Conciliada</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar transação</button></div></form></Modal>; }

createRoot(document.getElementById('root')).render(<App />);
