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
  status: index === 10 ? 'Em manutenção' : index === 11 ? 'Vaga' : 'Ocupada',
  tenant: index === 10 ? '—' : index === 11 ? '—' : ['Lívia Vieira', 'Pedro Antônio', 'Wesley Costa', 'João Pedro', 'Paulo Roberto', 'Gilselly Landim', 'Rita Barbosa', 'João Victor', 'Antônio Maurício', 'Maria Ludiane'][index] || 'Antonia Aline',
  rent: index === 10 || index === 11 ? 0 : index < 2 ? 500 : 600,
}));

const initialCharges = [
  { id: 1, unit: 'Kitnet 01', tenant: 'Lívia Vieira', due: '19/09/2026', amount: 500, status: 'Pago', paidAt: '21/09/2026' },
  { id: 2, unit: 'Kitnet 02', tenant: 'Pedro Antônio', due: '05/09/2026', amount: 600, status: 'Pago', paidAt: '05/09/2026' },
  { id: 3, unit: 'Kitnet 03', tenant: 'Wesley Costa', due: '08/09/2026', amount: 600, status: 'Pago', paidAt: '08/09/2026' },
  { id: 4, unit: 'Kitnet 04', tenant: 'João Pedro', due: '27/09/2026', amount: 600, status: 'Em aberto', paidAt: null },
  { id: 5, unit: 'Kitnet 05', tenant: 'Paulo Roberto', due: '26/09/2026', amount: 600, status: 'Em aberto', paidAt: null },
  { id: 6, unit: 'Kitnet 06', tenant: 'Gilselly Landim', due: '15/09/2026', amount: 600, status: 'Pago', paidAt: '07/09/2026' },
  { id: 7, unit: 'Kitnet 07', tenant: 'Rita Barbosa', due: '05/09/2026', amount: 600, status: 'Pago', paidAt: '02/09/2026' },
  { id: 8, unit: 'Kitnet 08', tenant: 'João Victor', due: '16/09/2026', amount: 500, status: 'Pago', paidAt: '15/09/2026' },
  { id: 9, unit: 'Kitnet 09', tenant: 'Antônio Maurício', due: '15/09/2026', amount: 600, status: 'Pago', paidAt: '15/09/2026' },
  { id: 10, unit: 'Kitnet 10', tenant: 'Maria Ludiane', due: '19/09/2026', amount: 600, status: 'Pago', paidAt: '19/09/2026' },
];

const initialContracts = [
  { id: 1, unit: 'Kitnet 01', tenant: 'Lívia Vieira', start: '19/06/2026', end: '18/06/2027', dueDay: 19, rent: 500, status: 'Ativo' },
  { id: 2, unit: 'Kitnet 02', tenant: 'Pedro Antônio', start: '05/02/2026', end: '04/02/2027', dueDay: 5, rent: 600, status: 'Ativo' },
  { id: 3, unit: 'Kitnet 03', tenant: 'Wesley Costa', start: '08/09/2026', end: '07/09/2027', dueDay: 8, rent: 600, status: 'Ativo' },
  { id: 4, unit: 'Kitnet 04', tenant: 'João Pedro', start: '27/08/2026', end: '26/08/2027', dueDay: 27, rent: 600, status: 'Ativo' },
  { id: 5, unit: 'Kitnet 05', tenant: 'Paulo Roberto', start: '26/08/2026', end: '25/08/2027', dueDay: 26, rent: 600, status: 'Ativo' },
  { id: 6, unit: 'Kitnet 06', tenant: 'Gilselly Landim', start: '11/06/2026', end: '10/06/2027', dueDay: 15, rent: 600, status: 'Ativo' },
  { id: 7, unit: 'Kitnet 07', tenant: 'Rita Barbosa', start: '01/07/2026', end: '30/06/2027', dueDay: 5, rent: 600, status: 'Ativo' },
  { id: 8, unit: 'Kitnet 08', tenant: 'João Victor', start: '16/12/2025', end: '15/12/2026', dueDay: 16, rent: 500, status: 'Ativo' },
  { id: 9, unit: 'Kitnet 09', tenant: 'Antônio Maurício', start: '15/09/2026', end: '14/09/2027', dueDay: 15, rent: 600, status: 'Ativo' },
  { id: 10, unit: 'Kitnet 10', tenant: 'Maria Ludiane', start: '19/05/2026', end: '18/05/2027', dueDay: 19, rent: 600, status: 'Ativo' },
];

const initialMaintenances = [
  { id: 1, openedAt: '02/09/2026', title: 'Vazamento no banheiro', unit: 'Kitnet 03', priority: 'Alta', status: 'Concluída', supplier: 'José Encanador' },
  { id: 2, openedAt: '11/09/2026', title: 'Revisão da iluminação externa', unit: 'Área comum', priority: 'Média', status: 'Em andamento', supplier: 'Casa Elétrica' },
];

const initialTerminations = [];

const initialTenants = [
  'Lívia Vieira', 'Pedro Antônio', 'Wesley Costa', 'João Pedro', 'Paulo Roberto', 'Gilselly Landim', 'Rita Barbosa', 'João Victor', 'Antônio Maurício', 'Maria Ludiane',
].map((name, index) => ({ id: index + 1, name, cpf: '', phone: '', email: '', status: 'Ativo' }));

const initialBankAccounts = [
  { id: 1, bank: 'Banco Inter', account: '•••• 3528', type: 'Conta corrente', status: 'Ativa' },
];

const initialSuppliers = [
  { id: 1, name: 'José Encanador', document: '', phone: '', category: 'Hidráulica', status: 'Ativo' },
  { id: 2, name: 'Casa Elétrica', document: '', phone: '', category: 'Elétrica', status: 'Ativo' },
  { id: 3, name: 'Maria Serviços', document: '', phone: '', category: 'Limpeza', status: 'Ativo' },
];

const initialExpenseCategories = [
  { id: 1, name: 'Manutenção', description: 'Reparos, conservação e melhorias', parentId: '', status: 'Ativa' },
  { id: 2, name: 'Serviços', description: 'Limpeza, mão de obra e serviços recorrentes', parentId: '', status: 'Ativa' },
  { id: 3, name: 'Material', description: 'Materiais de consumo e reparo', parentId: '', status: 'Ativa' },
  { id: 4, name: 'Utilidades', description: 'Água, energia, internet e similares', parentId: '', status: 'Ativa' },
  { id: 5, name: 'Hidráulica', description: 'Encanamento, registros e vazamentos', parentId: 1, status: 'Ativa' },
  { id: 6, name: 'Elétrica', description: 'Iluminação, tomadas e disjuntores', parentId: 1, status: 'Ativa' },
];

const initialExpenses = [
  { id: 1, date: '04/09/2026', dueDate: '10/09/2026', paidAt: '07/09/2026', description: 'Reparo hidráulico', supplier: 'José Encanador', unit: 'Kitnet 03', category: 'Manutenção', amount: 180, status: 'Conciliada' },
  { id: 2, date: '12/09/2026', dueDate: '20/09/2026', paidAt: '', description: 'Materiais elétricos', supplier: 'Casa Elétrica', unit: 'Área comum', category: 'Manutenção', amount: 245.5, status: 'Pendente' },
  { id: 3, date: '18/09/2026', dueDate: '25/09/2026', paidAt: '18/09/2026', description: 'Limpeza externa', supplier: 'Maria Serviços', unit: 'Área comum', category: 'Serviços', amount: 150, status: 'Conciliada' },
];

const bankItems = [
  { id: 1, date: '21/09/2026', description: 'PIX RECEBIDO LÍVIA VIEIRA', amount: 500, direction: 'Crédito', suggestion: 'Kitnet 01 · aluguel set/26', state: 'Sugerida' },
  { id: 2, date: '22/09/2026', description: 'PIX RECEBIDO JOÃO PEDRO', amount: 600, direction: 'Crédito', suggestion: 'Kitnet 04 · aluguel set/26', state: 'Sugerida' },
  { id: 3, date: '23/09/2026', description: 'PAGAMENTO CASA ELÉTRICA', amount: 245.5, direction: 'Débito', suggestion: 'Materiais elétricos', state: 'Sugerida' },
  { id: 4, date: '24/09/2026', description: 'PIX RECEBIDO SEM IDENTIFICAÇÃO', amount: 600, direction: 'Crédito', suggestion: null, state: 'Pendente' },
];

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
const isOpenCharge = (item) => !['Pago', 'Cancelada', 'Substituída por saldo'].includes(item.status);
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

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function App() {
  const [page, setPage] = useState('Visão geral');
  const [charges, setCharges] = useStoredState('cb-gestao:cobrancas', initialCharges);
  const [expenses, setExpenses] = useStoredState('cb-gestao:despesas', initialExpenses);
  const [bank, setBank] = useStoredState('cb-gestao:extrato', bankItems);
  const [contracts, setContracts] = useStoredState('cb-gestao:contratos', initialContracts);
  const [maintenances, setMaintenances] = useStoredState('cb-gestao:manutencoes', initialMaintenances);
  const [terminations, setTerminations] = useStoredState('cb-gestao:distratos', initialTerminations);
  const [tenants, setTenants] = useStoredState('cb-gestao:inquilinos', initialTenants);
  const [bankAccounts, setBankAccounts] = useStoredState('cb-gestao:contas-bancarias', initialBankAccounts);
  const [suppliers, setSuppliers] = useStoredState('cb-gestao:fornecedores', initialSuppliers);
  const [expenseCategories, setExpenseCategories] = useStoredState('cb-gestao:categorias-despesa', initialExpenseCategories);
  const [notice, setNotice] = useState('');
  const [showChargeForm, setShowChargeForm] = useState(null);
  const [receiptCharge, setReceiptCharge] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(null);
  const [showContractForm, setShowContractForm] = useState(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(null);
  const [maintenanceReport, setMaintenanceReport] = useState(null);
  const [registrationForm, setRegistrationForm] = useState(null);
  const [bankEdit, setBankEdit] = useState(null);
  const [showTerminationForm, setShowTerminationForm] = useState(null);
  const [tenantProfile, setTenantProfile] = useState(null);

  const income = useMemo(() => charges.reduce((sum, item) => sum + (item.receivedAmount ?? (item.status === 'Pago' ? item.amount : 0)), 0), [charges]);
  const paidExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const openCharges = useMemo(() => charges.filter(isOpenCharge), [charges]);
  const occupancy = initialUnits.filter((unit) => unit.status === 'Ocupada').length;

  const inform = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const navigate = (next) => {
    setPage(next);
    setShowChargeForm(false);
    setReceiptCharge(null);
    setShowExpenseForm(false);
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
      return [...updated, { id: `balance-${charge.id}-${Date.now()}`, originChargeId: charge.id, contractId: charge.contractId, unit: charge.unit, tenant: charge.tenant, due: formatBrDate(parseDate(newInvoiceDue)), competence: charge.competence, type: 'Saldo remanescente', amount: balance, status: 'Em aberto', paidAt: null }];
    });
    setReceiptCharge(null);
    inform(adjustmentType === 'partial' ? 'Recebimento parcial registrado e nova fatura gerada com o saldo restante.' : 'Recebimento registrado com valor, data e informação. O valor já compõe o resultado de caixa.');
  };

  const addCharge = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setCharges((items) => [...items, {
      id: Date.now(), unit: form.get('unit'), tenant: form.get('tenant'), due: formatBrDate(parseDate(form.get('due'))), amount: currencyValue(form.get('amount')), status: 'Em aberto', paidAt: null,
    }]);
    setShowChargeForm(false);
    inform('Cobrança incluída para validação local.');
  };

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

  const saveContract = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const attachment = form.get('attachment');
    const next = {
      ...(record || {}), id: record?.id || Date.now(), unit: form.get('unit'), tenant: form.get('tenant'), start: formatBrDate(parseDate(form.get('start'))), end: formatBrDate(parseDate(form.get('end'))), dueDay: Number(form.get('dueDay')), penaltyMultiplier: Number(form.get('penaltyMultiplier')), rent: currencyValue(form.get('rent')), status: form.get('status'), attachmentName: attachment?.size ? attachment.name : record?.attachmentName || '',
    };
    setContracts((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setShowContractForm(null);
    inform(record ? 'Contrato atualizado.' : 'Contrato cadastrado localmente. A geração automática das cobranças será a próxima etapa.');
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
    const termination = { ...(record || {}), id: record?.id || Date.now(), contractId: contract.id, unit: contract.unit, tenant: contract.tenant, terminationDate, penaltyDue, originalEnd: contract.end, totalDays, remainingDays, multiplier, calculatedPenalty, finalPenalty: Number.isFinite(finalPenalty) ? finalPenalty : calculatedPenalty, reason: form.get('reason') };
    setTerminations((items) => record ? items.map((item) => item.id === record.id ? termination : item) : [...items, termination]);
    setContracts((items) => items.map((item) => item.id === contract.id ? { ...item, status: 'Distratado', terminationDate } : item));
    setCharges((items) => {
      const updated = items.map((item) => {
        if (item.contractId === contract.id && item.type === 'Multa rescisória') return { ...item, due: penaltyDue, amount: termination.finalPenalty, status: item.status === 'Pago' ? 'Pago' : 'Em aberto' };
        const belongsToContract = item.contractId === contract.id || (!item.contractId && item.unit === contract.unit && item.tenant === contract.tenant);
        return belongsToContract && item.status === 'Em aberto' && parseBrDate(item.due) > terminationAt ? { ...item, status: 'Cancelada' } : item;
      });
      const penaltyExists = updated.some((item) => item.contractId === contract.id && item.type === 'Multa rescisória');
      return penaltyExists ? updated : [...updated, { id: `penalty-${contract.id}`, contractId: contract.id, unit: contract.unit, tenant: contract.tenant, due: penaltyDue, competence: 'Distrato', type: 'Multa rescisória', amount: termination.finalPenalty, status: 'Em aberto', paidAt: null }];
    });
    setShowTerminationForm(null);
    inform(record ? `Distrato atualizado. Multa rescisória ajustada para ${money(termination.finalPenalty)}.` : `Distrato registrado. Multa rescisória de ${money(termination.finalPenalty)} lançada para cobrança.`);
  };

  const generateContractCharges = (contract) => {
    const start = parseBrDate(contract.start);
    const end = parseBrDate(contract.end);
    const dueDay = Number(contract.dueDay) || start.getDate();
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      inform('Revise o período do contrato antes de gerar as cobranças.');
      return;
    }
    const newCharges = [];
    for (let cursor = new Date(start.getFullYear(), start.getMonth(), 1); cursor <= end; cursor.setMonth(cursor.getMonth() + 1)) {
      const lastDay = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
      const dueDate = new Date(cursor.getFullYear(), cursor.getMonth(), Math.min(dueDay, lastDay));
      if (dueDate < start || dueDate > end) continue;
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
      inform(`${unique.length} cobrança(s) gerada(s) dentro do período do contrato.`);
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
    const next = { ...previous, id: record?.id || Date.now(), openedAt: formatBrDate(parseDate(form.get('openedAt'))), title: form.get('title'), unit: form.get('unit'), priority: form.get('priority'), status: form.get('status'), supplier: form.get('supplier') || 'A definir' };
    setMaintenances((items) => record ? items.map((item) => item.id === record.id ? next : item) : [...items, next]);
    setShowMaintenanceForm(null);
    inform(record ? 'Manutenção atualizada.' : 'Manutenção registrada. Você poderá associar a despesa quando ela for paga.');
  };

  const saveTenant = (event, record) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = { ...(record || {}), id: record?.id || Date.now(), name: form.get('name'), cpf: form.get('cpf'), phone: form.get('phone'), email: form.get('email'), status: form.get('status') };
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

  const menu = ['Visão geral', 'Unidades', 'Contratos', 'Cobranças', 'Conciliação', 'Despesas', 'Manutenções', 'Distratos', 'Cadastros', 'Relatórios'];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><img src="/logo-cb.png" alt="CB Gestão" /></div>
      <nav>{menu.map((item) => <button className={page === item ? 'nav-item active' : 'nav-item'} key={item} onClick={() => navigate(item)}>{item}</button>)}</nav>
      <div className="sidebar-bottom"><span className="avatar">F</span><div><b>Fabi</b><small>Administrador</small></div></div>
    </aside>
    <main className="main">
      <header><div><p className="eyebrow">SETEMBRO DE 2026</p><h1>{page}</h1></div><button className="import-button" onClick={() => navigate('Conciliação')}>Importar extrato</button></header>
      {notice && <div className="toast">{notice}</div>}
      {page === 'Visão geral' && <Dashboard income={income} expenses={paidExpenses} openCharges={openCharges} occupancy={occupancy} navigate={navigate} />}
      {page === 'Unidades' && <Units />}
      {page === 'Contratos' && <Contracts items={contracts} generateCharges={generateContractCharges} edit={(record) => setShowContractForm(record)} openForm={() => setShowContractForm({})} form={showContractForm && <ContractForm record={showContractForm.id ? showContractForm : null} tenants={tenants} onClose={() => setShowContractForm(null)} onSubmit={saveContract} />} />}
      {page === 'Cobranças' && <Charges items={charges} registerReceipt={setReceiptCharge} openForm={() => setShowChargeForm({})} form={<>{showChargeForm && <ChargeForm onClose={() => setShowChargeForm(null)} onSubmit={addCharge} />}{receiptCharge && <ReceiptForm charge={receiptCharge} onClose={() => setReceiptCharge(null)} onSubmit={registerReceipt} />}</>} />}
      {page === 'Conciliação' && <Reconciliation items={bank} confirm={confirmBankItem} edit={setBankEdit} importStatement={importStatement} inform={inform} form={bankEdit && <BankTransactionForm record={bankEdit} onClose={() => setBankEdit(null)} onSubmit={saveBankItem} />} />}
      {page === 'Despesas' && <Expenses items={expenses} maintenances={maintenances} edit={(record) => setShowExpenseForm(record)} openForm={() => setShowExpenseForm({})} form={showExpenseForm && <ExpenseForm record={showExpenseForm.id ? showExpenseForm : null} categories={expenseCategories} suppliers={suppliers} maintenances={maintenances} onClose={() => setShowExpenseForm(null)} onSubmit={saveExpense} />} />}
      {page === 'Manutenções' && <Maintenances items={maintenances} expenses={expenses} openForm={() => setShowMaintenanceForm({})} edit={setShowMaintenanceForm} showReport={setMaintenanceReport} form={<>{showMaintenanceForm && <MaintenanceForm record={showMaintenanceForm.id ? showMaintenanceForm : null} onClose={() => setShowMaintenanceForm(null)} onSubmit={saveMaintenance} />}{maintenanceReport && <MaintenanceDetailReport maintenance={maintenanceReport} expenses={expenses.filter((item) => String(item.maintenanceId) === String(maintenanceReport.id))} onClose={() => setMaintenanceReport(null)} />}</>} />}
      {page === 'Distratos' && <Terminations items={terminations} openForm={() => setShowTerminationForm({})} edit={setShowTerminationForm} form={showTerminationForm && <TerminationForm record={showTerminationForm.id ? showTerminationForm : null} contracts={contracts} onClose={() => setShowTerminationForm(null)} onSubmit={saveTermination} />} />}
      {page === 'Cadastros' && <Registrations tenants={tenants} contracts={contracts} bankAccounts={bankAccounts} suppliers={suppliers} categories={expenseCategories} profile={tenantProfile} closeProfile={() => setTenantProfile(null)} openProfile={setTenantProfile} openForm={(type, record = null) => setRegistrationForm({ type, record })} form={registrationForm?.type === 'tenant' ? <TenantForm record={registrationForm.record} onClose={() => setRegistrationForm(null)} onSubmit={saveTenant} /> : registrationForm?.type === 'account' ? <BankAccountForm record={registrationForm.record} onClose={() => setRegistrationForm(null)} onSubmit={saveBankAccount} /> : registrationForm?.type === 'supplier' ? <SupplierForm record={registrationForm.record} onClose={() => setRegistrationForm(null)} onSubmit={saveSupplier} /> : registrationForm?.type === 'category' ? <ExpenseCategoryForm record={registrationForm.record} categories={expenseCategories} onClose={() => setRegistrationForm(null)} onSubmit={saveExpenseCategory} /> : null} />}
      {page === 'Relatórios' && <Reports charges={charges} expenses={expenses} suppliers={suppliers} maintenances={maintenances} units={initialUnits} />}
    </main>
  </div>;
}

function Dashboard({ income, expenses, openCharges, occupancy, navigate }) {
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
        <div className="action-box"><span className="action-number">4</span><div><b>Transações aguardando conciliação</b><small>Importe o extrato ou confirme as sugestões.</small></div><button className="solid-small" onClick={() => navigate('Conciliação')}>Conciliar</button></div>
        <div className="action-box"><span className="action-number amber">2</span><div><b>Unidades sem ocupação</b><small>Kitnet 11 em manutenção e Kitnet 12 vaga.</small></div><button className="plain-small" onClick={() => navigate('Unidades')}>Ver unidades</button></div>
      </article>
    </section>
  </>;
}

function Metric({ label, value, hint, tone }) { return <article className={`metric ${tone}`}><p>{label}</p><strong>{value}</strong><small>{hint}</small></article>; }

function Units() { return <section className="card"><div className="card-title"><div><p className="eyebrow">CADASTRO DO PRÉDIO</p><h2>12 unidades</h2></div><button className="solid-small">Adicionar unidade</button></div><div className="unit-grid">{initialUnits.map((unit) => <article className="unit-card" key={unit.id}><div className="unit-card-top"><span className={`status-dot ${statusClass(unit.status)}`}></span><span>{unit.status}</span></div><h3>{unit.name}</h3><p>{unit.tenant}</p><b>{unit.rent ? `${money(unit.rent)}/mês` : 'Sem contrato ativo'}</b><button className="link-button">Abrir histórico</button></article>)}</div></section>; }

function Contracts({ items, openForm, edit, generateCharges, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">CONTRATOS E COBRANÇAS</p><h2>Contratos</h2><small>O sistema gera uma cobrança para cada vencimento que cair dentro do período contratado.</small></div><button className="solid-small" onClick={openForm}>Novo contrato</button></div><Table headers={['Unidade', 'Inquilino', 'Período do contrato', 'Vencimento', 'Anexo', 'Situação', 'Ações']} rows={items.map((item) => [item.unit, item.tenant, `${item.start} até ${item.end}`, `Dia ${item.dueDay || parseBrDate(item.start).getDate()}`, item.attachmentName || 'Sem anexo', <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>, <span className="row-actions">{item.status === 'Ativo' && <button className="table-action" onClick={() => generateCharges(item)}>Gerar cobranças</button>}<button className="plain-small" onClick={() => edit(item)}>Editar</button></span>])} /></section></>; }

function Charges({ items, registerReceipt, openForm, form }) {
  const [filters, setFilters] = useState({ start: '', end: '', tenant: '' });
  const filtered = items.filter((item) => inRange(dateToIso(item.due), filters.start, filters.end) && (!filters.tenant || item.tenant === filters.tenant));
  return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">ALUGUÉIS · SET/2026</p><h2>Cobranças</h2></div><button className="solid-small" onClick={openForm}>Nova cobrança</button></div><FilterBar filters={filters} setFilters={setFilters} tenants={items.map((item) => item.tenant)} /><p className="filter-result">{filtered.length} cobrança(s) encontrada(s)</p><Table headers={['Unidade', 'Inquilino', 'Tipo', 'Vencimento', 'Valor', 'Situação', 'Recebimento', 'Ação']} rows={filtered.map((item) => [item.unit, item.tenant, item.type || 'Aluguel', item.due, money(item.amount), <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>, item.paidAt ? <span>{item.paidAt}<small className="receipt-value">{money(item.receivedAmount ?? item.amount)}</small>{item.penaltyInterestAmount ? <small className="receipt-value">Extra: {money(item.penaltyInterestAmount)} · {item.extraReference}</small> : null}</span> : '—', isOpenCharge(item) ? <button className="table-action" onClick={() => registerReceipt(item)}>Registrar recebimento</button> : <span className="muted">{item.status === 'Substituída por saldo' ? 'Saldo refaturado' : 'Confirmado'}</span>])} /></section></>;
}

function Reconciliation({ items, confirm, edit, importStatement, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">BANCO INTER</p><h2>Conciliação bancária</h2><small>Importe um CSV com as colunas Data, Descrição e Valor. As transações entram como pendentes para conferência.</small></div><label className="solid-small file-input">Selecionar CSV<input type="file" accept=".csv,text/csv" onChange={importStatement} /></label></div><div className="reconciliation-list">{items.map((item) => <article className="bank-row" key={item.id}><div className={`direction ${item.direction === 'Crédito' ? 'credit' : 'debit'}`}>{item.direction === 'Crédito' ? '↓' : '↑'}</div><div className="bank-main"><b>{item.description}</b><small>{item.date} · {item.direction}</small></div><div className="suggestion">{item.suggestion ? <><small>Sugestão</small><b>{item.suggestion}</b></> : <span className="badge pendente">Sem sugestão</span>}</div><div className="right"><b>{money(item.amount)}</b><span className={`badge ${statusClass(item.state)}`}>{item.state}</span></div><div className="bank-actions">{item.state === 'Sugerida' && <button className="solid-small" onClick={() => confirm(item.id)}>Confirmar</button>}<button className="plain-small" onClick={() => edit(item)}>Editar</button></div></article>)}</div></section></>; }

function Expenses({ items, maintenances, openForm, edit, form }) {
  const [filters, setFilters] = useState({ start: '', end: '', category: '' });
  const filtered = items.filter((item) => inRange(dateToIso(item.date), filters.start, filters.end) && (!filters.category || item.category === filters.category));
  const maintenanceName = (item) => maintenances.find((maintenance) => String(maintenance.id) === String(item.maintenanceId))?.title || 'Não vinculada';
  return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">PAGAMENTOS E MANUTENÇÃO</p><h2>Despesas</h2></div><button className="solid-small" onClick={openForm}>Lançar despesa</button></div><FilterBar filters={filters} setFilters={setFilters} categories={items.map((item) => item.category)} /><p className="filter-result">{filtered.length} despesa(s) encontrada(s) · {money(filtered.reduce((total, item) => total + item.amount, 0))}</p><Table headers={['Inclusão', 'Vencimento', 'Pagamento', 'Descrição', 'Fornecedor', 'Manutenção', 'Referência', 'Categoria', 'Valor', 'Situação', 'Ação']} rows={filtered.map((item) => [item.date, item.dueDate || 'Não informado', item.paidAt || 'Em aberto', item.description, item.supplier, maintenanceName(item), item.unit, item.category, money(item.amount), <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>, <button className="table-action" onClick={() => edit(item)}>Editar</button>])} /></section></>;
}

function Maintenances({ items, expenses, openForm, edit, showReport, form }) { const expenseTotal = (maintenance) => expenses.filter((item) => String(item.maintenanceId) === String(maintenance.id)).reduce((total, item) => total + item.amount, 0); return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">OPERAÇÃO DO PRÉDIO</p><h2>Manutenções</h2><small>Registre o chamado; os valores são lançados nas despesas vinculadas.</small></div><button className="solid-small" onClick={openForm}>Nova manutenção</button></div><Table headers={['Abertura', 'Solicitação', 'Referência', 'Prioridade', 'Fornecedor', 'Despesas vinculadas', 'Situação', 'Ações']} rows={items.map((item) => [item.openedAt, item.title, item.unit, <span className={`badge priority-${statusClass(item.priority)}`}>{item.priority}</span>, item.supplier, money(expenseTotal(item)), <span className={`badge maintenance-${statusClass(item.status)}`}>{item.status}</span>, <span className="row-actions"><button className="table-action" onClick={() => showReport(item)}>Relatório</button><button className="plain-small" onClick={() => edit(item)}>Editar</button></span>])} /></section></>; }

function MaintenanceDetailReport({ maintenance, expenses, onClose }) { const total = expenses.reduce((sum, item) => sum + item.amount, 0); return <Modal title={`Relatório · ${maintenance.title}`} onClose={onClose}><div className="profile-details"><div className="profile-contact"><span><b>Unidade</b>{maintenance.unit}</span><span><b>Situação</b>{maintenance.status}</span><span><b>Abertura</b>{maintenance.openedAt}</span><span><b>Total das despesas</b>{money(total)}</span></div><div><p className="eyebrow">DESPESAS VINCULADAS</p>{expenses.length ? <Table headers={['Inclusão', 'Descrição', 'Fornecedor', 'Pagamento', 'Valor']} rows={expenses.map((item) => [item.date, item.description, item.supplier, item.paidAt || 'Em aberto', money(item.amount)])} /> : <p className="muted">Nenhuma despesa foi vinculada a esta manutenção.</p>}</div></div></Modal>; }

function Terminations({ items, openForm, edit, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">ENCERRAMENTO DE CONTRATOS</p><h2>Distratos</h2><small>O distrato encerra o contrato, cancela cobranças futuras em aberto e cria a cobrança da multa rescisória.</small></div><button className="solid-small" onClick={openForm}>Novo distrato</button></div><Table headers={['Inquilino', 'Unidade', 'Data do distrato', 'Vencimento da multa', 'Término original', 'Dias restantes', 'Multa final', 'Ação']} rows={items.map((item) => [item.tenant, item.unit, item.terminationDate, item.penaltyDue || item.terminationDate, item.originalEnd, `${item.remainingDays} de ${item.totalDays}`, money(item.finalPenalty), <button className="table-action" onClick={() => edit(item)}>Editar distrato</button>])} /></section></>; }

function Registrations({ tenants, contracts, bankAccounts, suppliers, categories, openForm, form, profile, closeProfile, openProfile }) { const label = (item) => item.parentId ? `${categories.find((parent) => parent.id === Number(item.parentId))?.name || 'Categoria'} › ${item.name}` : item.name; return <>{form}{profile && <TenantProfile tenant={profile} contracts={contracts.filter((item) => item.tenant === profile.name)} onClose={closeProfile} />}<section className="registration-grid"><article className="card"><div className="card-title"><div><p className="eyebrow">PESSOAS</p><h2>Inquilinos</h2></div><button className="solid-small" onClick={() => openForm('tenant')}>Novo inquilino</button></div><Table headers={['Nome', 'CPF', 'Telefone', 'Situação', 'Ações']} rows={tenants.map((item) => [item.name, item.cpf || 'Não informado', item.phone || 'Não informado', <span className="badge pago">{item.status}</span>, <span className="row-actions"><button className="table-action" onClick={() => openProfile(item)}>Ver cadastro</button><button className="plain-small" onClick={() => openForm('tenant', item)}>Editar</button></span>])} /></article><article className="card"><div className="card-title"><div><p className="eyebrow">PARCEIROS</p><h2>Fornecedores</h2></div><button className="solid-small" onClick={() => openForm('supplier')}>Novo fornecedor</button></div><Table headers={['Nome', 'Categoria', 'Telefone', 'Situação', 'Ação']} rows={suppliers.map((item) => [item.name, item.category || 'Não informada', item.phone || 'Não informado', <span className="badge pago">{item.status}</span>, <button className="table-action" onClick={() => openForm('supplier', item)}>Editar</button>])} /></article><article className="card"><div className="card-title"><div><p className="eyebrow">FINANCEIRO</p><h2>Contas bancárias</h2></div><button className="solid-small" onClick={() => openForm('account')}>Nova conta</button></div><Table headers={['Banco', 'Conta', 'Tipo', 'Situação', 'Ação']} rows={bankAccounts.map((item) => [item.bank, item.account, item.type, <span className="badge pago">{item.status}</span>, <button className="table-action" onClick={() => openForm('account', item)}>Editar</button>])} /></article><article className="card"><div className="card-title"><div><p className="eyebrow">FINANCEIRO</p><h2>Categorias e subcategorias</h2></div><button className="solid-small" onClick={() => openForm('category')}>Nova categoria</button></div><Table headers={['Categoria', 'Descrição', 'Situação', 'Ação']} rows={categories.map((item) => [label(item), item.description || 'Sem descrição', <span className="badge pago">{item.status}</span>, <button className="table-action" onClick={() => openForm('category', item)}>Editar</button>])} /></article></section></>; }

function TenantProfile({ tenant, contracts, onClose }) { return <Modal title={`Cadastro de ${tenant.name}`} onClose={onClose}><div className="profile-details"><div className="profile-contact"><span><b>CPF</b>{tenant.cpf || 'Não informado'}</span><span><b>Telefone</b>{tenant.phone || 'Não informado'}</span><span><b>E-mail</b>{tenant.email || 'Não informado'}</span><span><b>Situação</b>{tenant.status}</span></div><div><p className="eyebrow">HISTÓRICO CONTRATUAL</p><h3>Contratos e anexos</h3>{contracts.length ? <div className="profile-contracts">{contracts.map((contract) => <article key={contract.id}><b>{contract.unit}</b><small>{contract.start} até {contract.end} · vencimento dia {contract.dueDay || parseBrDate(contract.start).getDate()}</small><small>Multa contratual: {Number(contract.penaltyMultiplier) || 0} × aluguel</small><span>{contract.attachmentName ? `Anexo: ${contract.attachmentName}` : 'Sem anexo cadastrado'}</span>{contract.terminationDate && <em>Distratado em {contract.terminationDate}</em>}</article>)}</div> : <p className="muted">Não há contratos vinculados a este cadastro.</p>}</div></div></Modal>; }

function Reports({ charges, expenses, suppliers, maintenances, units }) {
  const [selected, setSelected] = useState('');
  const [filters, setFilters] = useState({ start: '', end: '', tenant: '', category: '', unit: '', supplier: '' });
  const filteredCharges = charges.filter((item) => inRange(dateToIso(item.paidAt || item.due), filters.start, filters.end) && (!filters.tenant || item.tenant === filters.tenant) && (!filters.unit || item.unit === filters.unit));
  const filteredExpenses = expenses.filter((item) => inRange(dateToIso(item.date), filters.start, filters.end) && (!filters.category || item.category === filters.category) && (!filters.unit || item.unit === filters.unit) && (!filters.supplier || item.supplier === filters.supplier));
  const filteredMaintenances = maintenances.filter((item) => inRange(dateToIso(item.openedAt), filters.start, filters.end) && (!filters.unit || item.unit === filters.unit));
  const received = (unit) => filteredCharges.filter((item) => !unit || item.unit === unit).reduce((total, item) => total + (item.receivedAmount ?? (item.status === 'Pago' ? item.amount : 0)), 0);
  const expense = (unit) => filteredExpenses.filter((item) => !unit || item.unit === unit).reduce((total, item) => total + item.amount, 0);
  const income = received(); const expenseTotal = expense(); const openTotal = filteredCharges.filter(isOpenCharge).reduce((total, item) => total + item.amount, 0);
  const unitRows = units.filter((item) => item.rent).map((item) => [item.name, received(item.name), expense(item.name), received(item.name) - expense(item.name)]);
  const expenseUnits = [...new Set(filteredExpenses.map((item) => item.unit))].map((unit) => [unit, filteredExpenses.filter((item) => item.unit === unit).length, expense(unit)]);
  const supplierRows = [...new Set(filteredExpenses.map((item) => item.supplier))].map((supplier) => [supplier, filteredExpenses.filter((item) => item.supplier === supplier).length, filteredExpenses.filter((item) => item.supplier === supplier).reduce((sum, item) => sum + item.amount, 0)]);
  const maintenanceRows = [...new Set(filteredMaintenances.map((item) => item.unit))].map((unit) => { const items = filteredMaintenances.filter((item) => item.unit === unit); const ids = new Set(items.map((item) => String(item.id))); return [unit, items.length, items.filter((item) => item.status === 'Concluída').length, items.filter((item) => !['Concluída', 'Cancelada'].includes(item.status)).length, filteredExpenses.filter((item) => ids.has(String(item.maintenanceId))).reduce((sum, item) => sum + item.amount, 0)]; });
  const catalog = [{ id: 'result', category: 'Financeiro', title: 'Resultado por unidade' }, { id: 'receipts', category: 'Financeiro', title: 'Recebimentos por unidade' }, { id: 'expense-unit', category: 'Despesas', title: 'Pagamentos por unidade' }, { id: 'supplier', category: 'Despesas', title: 'Pagamentos por fornecedor' }, { id: 'maintenance', category: 'Operação', title: 'Manutenções por unidade' }, { id: 'open', category: 'Cobranças', title: 'Valores em aberto' }];
  if (!selected) return <section className="card"><div className="card-title"><div><p className="eyebrow">CENTRAL DE RELATÓRIOS</p><h2>Escolha um relatório</h2><small>Os relatórios são organizados por categoria e possuem filtros próprios.</small></div></div><div className="report-catalog">{catalog.map((item) => <button key={item.id} className="report-option" onClick={() => setSelected(item.id)}><span>{item.category}</span><b>{item.title}</b><small>Abrir relatório</small></button>)}</div></section>;
  const title = catalog.find((item) => item.id === selected)?.title;
  const content = selected === 'result' ? <Table headers={['Unidade', 'Recebido', 'Despesas', 'Resultado']} rows={unitRows.map((row) => [row[0], money(row[1]), money(row[2]), money(row[3])])} /> : selected === 'receipts' ? <Table headers={['Unidade', 'Recebido']} rows={unitRows.map((row) => [row[0], money(row[1])])} /> : selected === 'expense-unit' ? <Table headers={['Unidade', 'Lançamentos', 'Valor']} rows={expenseUnits.map((row) => [row[0], row[1], money(row[2])])} /> : selected === 'supplier' ? <Table headers={['Fornecedor', 'Lançamentos', 'Valor']} rows={supplierRows.map((row) => [row[0], row[1], money(row[2])])} /> : selected === 'maintenance' ? <Table headers={['Unidade', 'Total', 'Concluídas', 'Em aberto', 'Despesas vinculadas']} rows={maintenanceRows.map((row) => [row[0], row[1], row[2], row[3], money(row[4])])} /> : <Table headers={['Unidade', 'Inquilino', 'Vencimento', 'Tipo', 'Valor']} rows={filteredCharges.filter(isOpenCharge).map((item) => [item.unit, item.tenant, item.due, item.type || 'Aluguel', money(item.amount)])} />;
  return <><section className="card report-filter"><div className="card-title"><div><p className="eyebrow">RELATÓRIO</p><h2>{title}</h2></div><button className="plain-small" onClick={() => setSelected('')}>Todos os relatórios</button></div><FilterBar filters={filters} setFilters={setFilters} tenants={charges.map((item) => item.tenant)} categories={expenses.map((item) => item.category)} units={units.map((item) => item.name)} suppliers={suppliers.map((item) => item.name)} /></section><section className="metric-grid"><Metric label="Recebido" value={money(income)} hint="No período filtrado" tone="green" /><Metric label="Despesas" value={money(expenseTotal)} hint="No período filtrado" tone="orange" /><Metric label="Resultado" value={money(income - expenseTotal)} hint="Base caixa" tone="blue" /><Metric label="Em aberto" value={money(openTotal)} hint={`${filteredCharges.filter(isOpenCharge).length} cobrança(s)`} tone="purple" /></section><section className="card"><div className="card-title"><div><p className="eyebrow">DADOS FILTRADOS</p><h2>{title}</h2></div></div>{content}</section></>;
}

function FilterBar({ filters, setFilters, tenants = [], categories = [], units = [], suppliers = [] }) {
  const update = (key, value) => setFilters({ ...filters, [key]: value });
  const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  return <div className="filter-bar"><label>De<input type="date" value={filters.start} onChange={(event) => update('start', event.target.value)} /></label><label>Até<input type="date" value={filters.end} onChange={(event) => update('end', event.target.value)} /></label>{units.length > 0 && <label>Unidade<select value={filters.unit || ''} onChange={(event) => update('unit', event.target.value)}><option value="">Todas</option>{unique(units).map((unit) => <option key={unit}>{unit}</option>)}</select></label>}{tenants.length > 0 && <label>Inquilino<select value={filters.tenant || ''} onChange={(event) => update('tenant', event.target.value)}><option value="">Todos</option>{unique(tenants).map((tenant) => <option key={tenant}>{tenant}</option>)}</select></label>}{categories.length > 0 && <label>Categoria<select value={filters.category || ''} onChange={(event) => update('category', event.target.value)}><option value="">Todas</option>{unique(categories).map((category) => <option key={category}>{category}</option>)}</select></label>}{suppliers.length > 0 && <label>Fornecedor<select value={filters.supplier || ''} onChange={(event) => update('supplier', event.target.value)}><option value="">Todos</option>{unique(suppliers).map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>}<button className="clear-filter" type="button" onClick={() => setFilters({ start: '', end: '', tenant: '', category: '', unit: '', supplier: '' })}>Limpar filtros</button></div>;
}

function Table({ headers, rows }) { return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td data-label={headers[cellIndex]} key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>; }

function Modal({ title, children, onClose }) { return <div className="modal-backdrop"><section className="modal"><div className="modal-head"><h2>{title}</h2><button onClick={onClose}>×</button></div>{children}</section></div>; }
function CurrencyInput({ name, defaultValue = 0, value, onValueChange, readOnly = false }) { const [display, setDisplay] = useState(money(value ?? defaultValue)); useEffect(() => { if (value !== undefined) setDisplay(money(value)); }, [value]); const change = (event) => { const next = currencyValue(event.target.value); setDisplay(money(next)); onValueChange?.(next); }; return <input name={name} type="text" inputMode="numeric" value={display} readOnly={readOnly} onChange={change} aria-label={name} />; }
function ChargeForm({ onClose, onSubmit }) { return <Modal title="Nova cobrança" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Unidade<select name="unit" required>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Inquilino<input name="tenant" required placeholder="Nome do inquilino" /></label><label>Vencimento<input name="due" required type="date" defaultValue={dateInputValue()} /></label><label>Valor<CurrencyInput name="amount" /></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar cobrança</button></div></form></Modal>; }
function ReceiptForm({ charge, onClose, onSubmit }) {
  const received = charge.receivedAmount || 0;
  const settled = charge.settledAmount ?? received;
  const remaining = Math.max(0, charge.amount - settled);
  const [paymentAmount, setPaymentAmount] = useState(remaining);
  const [adjustmentType, setAdjustmentType] = useState('');
  const difference = Math.abs(Number(paymentAmount || 0) - remaining);
  return <Modal title={`Recebimento · ${charge.unit}`} onClose={onClose}><form onSubmit={(event) => onSubmit(event, charge)} className="form-grid"><div className="termination-summary"><b>{charge.tenant} · vencimento {charge.due}</b><span>Cobrança: {money(charge.amount)} · já recebido: {money(received)}</span><strong>Saldo: {money(remaining)}</strong></div><label>Valor do pagamento<CurrencyInput name="amount" value={paymentAmount} onValueChange={(value) => { setPaymentAmount(value); setAdjustmentType(''); }} /></label><label>Data do recebimento<input name="receivedOn" required type="date" defaultValue={dateInputValue()} /></label>{difference > 0.001 ? <><label className="full">Motivo da diferença<select name="adjustmentType" required value={adjustmentType} onChange={(event) => setAdjustmentType(event.target.value)}><option value="" disabled>Selecione o ajuste aplicado</option>{paymentAmount < remaining ? <><option value="discount">Desconto concedido</option><option value="partial">Pagamento parcial (gerar nova fatura)</option></> : <option value="penaltyInterest">Multa e juros aplicados</option>}</select></label><div className="adjustment-note">Diferença apurada: <b>{money(difference)}</b>{paymentAmount < remaining ? ' — será registrada como desconto ou saldo parcial.' : ' — será registrada como multa e juros.'}</div>{adjustmentType === 'partial' && <label className="full">Vencimento da nova fatura<input name="newInvoiceDue" required type="date" defaultValue={dateInputValue()} /></label>}{adjustmentType === 'penaltyInterest' && <><label>Valor extra<CurrencyInput name="extraAmount" value={difference} readOnly /></label><label>Referência do valor extra<input name="extraReference" required placeholder="Ex.: multa por atraso de setembro" /></label></>}</> : <input type="hidden" name="adjustmentType" value="none" />}<label className="full">Informações do pagamento<textarea name="information" required placeholder="Ex.: PIX Banco Inter, identificador da transação ou observação" /></label><p className="form-note">No pagamento parcial, a cobrança atual fica encerrada e é criada uma nova fatura com o saldo restante.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Confirmar recebimento</button></div></form></Modal>;
}
function ExpenseForm({ categories, suppliers, maintenances, record, onClose, onSubmit }) { const optionLabel = (item) => item.parentId ? `${categories.find((parent) => parent.id === Number(item.parentId))?.name || 'Categoria'} › ${item.name}` : item.name; return <Modal title={record ? 'Editar despesa' : 'Lançar despesa'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Data de inclusão<input name="includedAt" required type="date" defaultValue={record?.date ? dateToIso(record.date) : dateInputValue()} /></label><label>Vencimento<input name="dueDate" required type="date" defaultValue={record?.dueDate ? dateToIso(record.dueDate) : dateInputValue()} /></label><label>Data de pagamento<input name="paidAt" type="date" defaultValue={record?.paidAt ? dateToIso(record.paidAt) : ''} /><small>Preencha quando a despesa for paga.</small></label><label>Valor<CurrencyInput name="amount" defaultValue={record?.amount || 0} /></label><label className="full">Descrição<input name="description" required defaultValue={record?.description} placeholder="O que foi pago?" /></label><label>Fornecedor<select name="supplier" required defaultValue={record?.supplier || ''}><option value="">Selecione</option>{suppliers.filter((item) => item.status === 'Ativo' || item.name === record?.supplier).map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label>Referência<select name="unit" defaultValue={record?.unit || 'Área comum'}><option>Área comum</option>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label className="full">Vincular à manutenção<select name="maintenanceId" defaultValue={record?.maintenanceId || ''}><option value="">Sem manutenção vinculada</option>{maintenances.filter((item) => !['Concluída', 'Cancelada'].includes(item.status) || String(item.id) === String(record?.maintenanceId)).map((item) => <option key={item.id} value={item.id}>{item.unit} · {item.title} · {item.status}</option>)}</select><small>Somente manutenções ainda não concluídas podem receber novas despesas.</small></label><label>Categoria<select name="category" defaultValue={record?.category}>{categories.filter((item) => item.status === 'Ativa').map((item) => <option key={item.id} value={optionLabel(item)}>{optionLabel(item)}</option>)}</select></label><label>Situação<select name="status" defaultValue={record?.status || 'Pendente'}><option>Pendente</option><option>Conciliada</option><option>Paga</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar despesa</button></div></form></Modal>; }
function ContractForm({ tenants, record, onClose, onSubmit }) { const defaultDueDay = record?.dueDay || (record?.start ? parseBrDate(record.start).getDate() : 5); return <Modal title={record ? 'Editar contrato' : 'Novo contrato'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Unidade<select name="unit" required defaultValue={record?.unit}>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Inquilino titular<select name="tenant" required defaultValue={record?.tenant || ''}><option value="">Selecione</option>{tenants.filter((item) => item.status === 'Ativo').map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label>Início do contrato<input name="start" required type="date" defaultValue={dateFieldValue(record?.start, dateInputValue())} /></label><label>Fim do contrato<input name="end" required type="date" defaultValue={dateFieldValue(record?.end, dateInputValue())} /></label><label>Dia de vencimento da fatura<input name="dueDay" required type="number" min="1" max="31" defaultValue={defaultDueDay} /></label><label>Aluguel mensal<CurrencyInput name="rent" defaultValue={record?.rent || 0} /></label><label>Multiplicador da multa<input name="penaltyMultiplier" required type="number" min="0" step="0.01" defaultValue={record?.penaltyMultiplier ?? 0} /><small>Ex.: 3 para três aluguéis.</small></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativo'}><option>Ativo</option><option>Encerrado</option><option>Cancelado</option></select></label><label className="full">Contrato de aluguel (anexo)<input name="attachment" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />{record?.attachmentName && <small>Anexo atual: {record.attachmentName}</small>}</label><p className="form-note">As cobranças serão geradas pelo dia de vencimento, somente quando a data estiver dentro do período do contrato. O anexo será associado ao histórico do inquilino.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar contrato</button></div></form></Modal>; }

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
  return <Modal title={record ? 'Editar distrato e multa' : 'Novo distrato'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label className="full">Contrato<select name="contractId" required value={contractId} onChange={(event) => setContractId(event.target.value)}><option value="">Selecione</option>{availableContracts.map((item) => <option key={item.id} value={item.id}>{item.unit} · {item.tenant} · até {item.end}</option>)}</select></label><label>Data do distrato<input name="terminationDate" type="date" required value={terminationDate} onChange={(event) => setTerminationDate(event.target.value)} /></label><label>Vencimento da multa<input name="penaltyDue" type="date" required value={penaltyDue} onChange={(event) => setPenaltyDue(event.target.value)} /></label><label>Multa final (editável)<CurrencyInput name="finalPenalty" value={finalPenalty} onValueChange={setFinalPenalty} /></label><div className="termination-summary"><b>Cálculo proporcional</b><span>{calculation.remainingDays} dias restantes de {calculation.totalDays} dias</span><strong>{money(calculation.calculatedPenalty)}</strong><small>{Number(contract?.penaltyMultiplier) || 0} × {money(Number(contract?.rent) || 0)} × período restante</small></div><label className="full">Motivo do distrato<textarea name="reason" required defaultValue={record?.reason} placeholder="Descreva o motivo e eventuais acordos" /></label><p className="form-note">Ao salvar, o contrato será marcado como distratado, as cobranças futuras em aberto serão canceladas e a multa será lançada em Cobranças no vencimento escolhido.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">{record ? 'Salvar ajustes' : 'Registrar distrato'}</button></div></form></Modal>;
}
function MaintenanceForm({ record, onClose, onSubmit }) { return <Modal title={record ? 'Editar manutenção' : 'Nova manutenção'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Data de abertura<input name="openedAt" required type="date" defaultValue={dateFieldValue(record?.openedAt, dateInputValue())} /></label><label>Referência<select name="unit" defaultValue={record?.unit || 'Área comum'}><option>Área comum</option>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label className="full">Solicitação<input name="title" required defaultValue={record?.title} placeholder="Descreva o problema ou serviço" /></label><label>Prioridade<select name="priority" defaultValue={record?.priority || 'Média'}><option>Baixa</option><option>Média</option><option>Alta</option></select></label><label>Situação<select name="status" defaultValue={record?.status || 'Aberta'}><option>Aberta</option><option>Em andamento</option><option>Aguardando fornecedor</option><option>Concluída</option><option>Cancelada</option></select></label><label>Fornecedor ou responsável<input name="supplier" defaultValue={record?.supplier} placeholder="A definir" /></label><p className="form-note">Os custos são lançados exclusivamente em Despesas e vinculados a esta manutenção enquanto ela estiver aberta.</p><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar manutenção</button></div></form></Modal>; }
function TenantForm({ record, onClose, onSubmit }) { return <Modal title={record ? 'Editar inquilino' : 'Novo inquilino'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label className="full">Nome completo<input name="name" required defaultValue={record?.name} placeholder="Nome do inquilino" /></label><label>CPF<input name="cpf" defaultValue={record?.cpf} placeholder="000.000.000-00" /></label><label>Telefone<input name="phone" defaultValue={record?.phone} placeholder="(00) 00000-0000" /></label><label className="full">E-mail<input name="email" type="email" defaultValue={record?.email} placeholder="nome@exemplo.com" /></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativo'}><option>Ativo</option><option>Inativo</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar inquilino</button></div></form></Modal>; }
function BankAccountForm({ record, onClose, onSubmit }) { return <Modal title={record ? 'Editar conta bancária' : 'Nova conta bancária'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Banco<input name="bank" required defaultValue={record?.bank} placeholder="Nome do banco" /></label><label>Tipo<select name="type" defaultValue={record?.type || 'Conta corrente'}><option>Conta corrente</option><option>Conta pagamento</option><option>Poupança</option></select></label><label className="full">Identificação da conta<input name="account" required defaultValue={record?.account} placeholder="Agência e conta ou apelido" /></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativa'}><option>Ativa</option><option>Inativa</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar conta</button></div></form></Modal>; }
function SupplierForm({ record, onClose, onSubmit }) { return <Modal title={record ? 'Editar fornecedor' : 'Novo fornecedor'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label className="full">Nome ou razão social<input name="name" required defaultValue={record?.name} placeholder="Nome do fornecedor" /></label><label>CPF ou CNPJ<input name="document" defaultValue={record?.document} placeholder="Opcional" /></label><label>Telefone<input name="phone" defaultValue={record?.phone} placeholder="(00) 00000-0000" /></label><label>Categoria principal<input name="category" defaultValue={record?.category} placeholder="Ex.: Hidráulica" /></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativo'}><option>Ativo</option><option>Inativo</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar fornecedor</button></div></form></Modal>; }
function ExpenseCategoryForm({ categories, record, onClose, onSubmit }) { return <Modal title={record ? 'Editar categoria' : 'Nova categoria de despesa'} onClose={onClose}><form onSubmit={(event) => onSubmit(event, record)} className="form-grid"><label>Nome da categoria<input name="name" required defaultValue={record?.name} placeholder="Ex.: Pintura" /></label><label>Categoria principal<select name="parentId" defaultValue={record?.parentId || ''}><option value="">Esta é uma categoria principal</option>{categories.filter((item) => !item.parentId && item.id !== record?.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="full">Descrição<input name="description" defaultValue={record?.description} placeholder="Quando esta categoria deve ser usada?" /></label><label>Situação<select name="status" defaultValue={record?.status || 'Ativa'}><option>Ativa</option><option>Inativa</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar categoria</button></div></form></Modal>; }
function BankTransactionForm({ record, onClose, onSubmit }) { return <Modal title="Editar transação bancária" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Data<input name="date" required type="date" defaultValue={dateFieldValue(record.date)} /></label><label>Valor<CurrencyInput name="amount" defaultValue={record.amount} /></label><label className="full">Descrição<input name="description" required defaultValue={record.description} /></label><label>Tipo<select name="direction" defaultValue={record.direction}><option>Crédito</option><option>Débito</option></select></label><label>Situação<select name="state" defaultValue={record.state}><option>Pendente</option><option>Sugerida</option><option>Conciliada</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar transação</button></div></form></Modal>; }

createRoot(document.getElementById('root')).render(<App />);
