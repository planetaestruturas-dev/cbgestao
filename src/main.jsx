import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './mobile.css';
import './components.css';
import './functional.css';

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
  { id: 1, unit: 'Kitnet 01', tenant: 'Lívia Vieira', start: '19/06/2026', end: '18/06/2027', rent: 500, status: 'Ativo' },
  { id: 2, unit: 'Kitnet 02', tenant: 'Pedro Antônio', start: '05/02/2026', end: '04/02/2027', rent: 600, status: 'Ativo' },
  { id: 3, unit: 'Kitnet 03', tenant: 'Wesley Costa', start: '08/09/2026', end: '07/09/2027', rent: 600, status: 'Ativo' },
  { id: 4, unit: 'Kitnet 04', tenant: 'João Pedro', start: '27/08/2026', end: '26/08/2027', rent: 600, status: 'Ativo' },
  { id: 5, unit: 'Kitnet 05', tenant: 'Paulo Roberto', start: '26/08/2026', end: '25/08/2027', rent: 600, status: 'Ativo' },
  { id: 6, unit: 'Kitnet 06', tenant: 'Gilselly Landim', start: '11/06/2026', end: '10/06/2027', rent: 600, status: 'Ativo' },
  { id: 7, unit: 'Kitnet 07', tenant: 'Rita Barbosa', start: '01/07/2026', end: '30/06/2027', rent: 600, status: 'Ativo' },
  { id: 8, unit: 'Kitnet 08', tenant: 'João Victor', start: '16/12/2025', end: '15/12/2026', rent: 500, status: 'Ativo' },
  { id: 9, unit: 'Kitnet 09', tenant: 'Antônio Maurício', start: '15/09/2026', end: '14/09/2027', rent: 600, status: 'Ativo' },
  { id: 10, unit: 'Kitnet 10', tenant: 'Maria Ludiane', start: '19/05/2026', end: '18/05/2027', rent: 600, status: 'Ativo' },
];

const initialMaintenances = [
  { id: 1, openedAt: '02/09/2026', title: 'Vazamento no banheiro', unit: 'Kitnet 03', priority: 'Alta', status: 'Concluída', supplier: 'José Encanador', estimated: 200, actual: 180 },
  { id: 2, openedAt: '11/09/2026', title: 'Revisão da iluminação externa', unit: 'Área comum', priority: 'Média', status: 'Em andamento', supplier: 'Casa Elétrica', estimated: 300, actual: 245.5 },
];

const initialExpenses = [
  { id: 1, date: '04/09/2026', description: 'Reparo hidráulico', supplier: 'José Encanador', unit: 'Kitnet 03', category: 'Manutenção', amount: 180, status: 'Conciliada' },
  { id: 2, date: '12/09/2026', description: 'Materiais elétricos', supplier: 'Casa Elétrica', unit: 'Área comum', category: 'Manutenção', amount: 245.5, status: 'Pendente' },
  { id: 3, date: '18/09/2026', description: 'Limpeza externa', supplier: 'Maria Serviços', unit: 'Área comum', category: 'Serviços', amount: 150, status: 'Conciliada' },
];

const bankItems = [
  { id: 1, date: '21/09/2026', description: 'PIX RECEBIDO LÍVIA VIEIRA', amount: 500, direction: 'Crédito', suggestion: 'Kitnet 01 · aluguel set/26', state: 'Sugerida' },
  { id: 2, date: '22/09/2026', description: 'PIX RECEBIDO JOÃO PEDRO', amount: 600, direction: 'Crédito', suggestion: 'Kitnet 04 · aluguel set/26', state: 'Sugerida' },
  { id: 3, date: '23/09/2026', description: 'PAGAMENTO CASA ELÉTRICA', amount: 245.5, direction: 'Débito', suggestion: 'Materiais elétricos', state: 'Sugerida' },
  { id: 4, date: '24/09/2026', description: 'PIX RECEBIDO SEM IDENTIFICAÇÃO', amount: 600, direction: 'Crédito', suggestion: null, state: 'Pendente' },
];

const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const statusClass = (status) => status.toLowerCase().replaceAll(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const dateToIso = (date) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};
const inRange = (date, start, end) => (!start || date >= start) && (!end || date <= end);
const todayDisplay = () => new Intl.DateTimeFormat('pt-BR').format(new Date());
const normalizeHeader = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const parseBrazilianAmount = (value) => {
  const cleaned = String(value || '').replace(/[^0-9,.-]/g, '').trim();
  if (!cleaned) return 0;
  const normalized = cleaned.includes(',') ? cleaned.replaceAll('.', '').replace(',', '.') : cleaned;
  return Number(normalized) || 0;
};
const parseStatementCsv = (text) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error('O arquivo precisa ter cabeçalho e ao menos uma transação.');
  const separator = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',';
  const headers = lines[0].split(separator).map(normalizeHeader);
  const findColumn = (...names) => headers.findIndex((header) => names.some((name) => header.includes(name)));
  const dateIndex = findColumn('data');
  const descriptionIndex = findColumn('descricao', 'historico', 'lancamento', 'nome');
  const amountIndex = findColumn('valor', 'amount');
  if (dateIndex === -1 || amountIndex === -1) throw new Error('Não encontrei as colunas Data e Valor no arquivo.');
  return lines.slice(1).map((line, index) => {
    const columns = line.split(separator).map((value) => value.trim().replace(/^"|"$/g, ''));
    const rawAmount = parseBrazilianAmount(columns[amountIndex]);
    const description = descriptionIndex === -1 ? 'Transação importada' : columns[descriptionIndex] || 'Transação importada';
    return { id: `csv-${Date.now()}-${index}`, date: columns[dateIndex], description, amount: Math.abs(rawAmount), direction: rawAmount >= 0 ? 'Crédito' : 'Débito', suggestion: null, state: 'Pendente', imported: true };
  }).filter((item) => item.amount > 0);
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
  const [notice, setNotice] = useState('');
  const [showChargeForm, setShowChargeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  const income = useMemo(() => charges.filter((item) => item.status === 'Pago').reduce((sum, item) => sum + item.amount, 0), [charges]);
  const paidExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const openCharges = useMemo(() => charges.filter((item) => item.status !== 'Pago'), [charges]);
  const occupancy = initialUnits.filter((unit) => unit.status === 'Ocupada').length;

  const inform = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const navigate = (next) => {
    setPage(next);
    setShowChargeForm(false);
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

  const registerReceipt = (id) => {
    setCharges((items) => items.map((item) => item.id === id ? { ...item, status: 'Pago', paidAt: todayDisplay() } : item));
    inform('Recebimento registrado. O valor já compõe o resultado de caixa.');
  };

  const addCharge = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setCharges((items) => [...items, {
      id: Date.now(), unit: form.get('unit'), tenant: form.get('tenant'), due: form.get('due'), amount: Number(form.get('amount')), status: 'Em aberto', paidAt: null,
    }]);
    setShowChargeForm(false);
    inform('Cobrança incluída para validação local.');
  };

  const addExpense = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setExpenses((items) => [...items, {
      id: Date.now(), date: form.get('date'), description: form.get('description'), supplier: form.get('supplier'), unit: form.get('unit'), category: form.get('category'), amount: Number(form.get('amount')), status: 'Pendente',
    }]);
    setShowExpenseForm(false);
    inform('Despesa incluída para validação local.');
  };

  const addContract = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setContracts((items) => [...items, { id: Date.now(), unit: form.get('unit'), tenant: form.get('tenant'), start: form.get('start'), end: form.get('end'), rent: Number(form.get('rent')), status: 'Ativo' }]);
    setShowContractForm(false);
    inform('Contrato cadastrado localmente. A geração automática das cobranças será a próxima etapa.');
  };

  const addMaintenance = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMaintenances((items) => [...items, { id: Date.now(), openedAt: form.get('openedAt'), title: form.get('title'), unit: form.get('unit'), priority: form.get('priority'), status: 'Aberta', supplier: form.get('supplier') || 'A definir', estimated: Number(form.get('estimated') || 0), actual: 0 }]);
    setShowMaintenanceForm(false);
    inform('Manutenção registrada. Você poderá associar a despesa quando ela for paga.');
  };

  const menu = ['Visão geral', 'Unidades', 'Contratos', 'Cobranças', 'Conciliação', 'Despesas', 'Manutenções', 'Relatórios'];
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
      {page === 'Contratos' && <Contracts items={contracts} openForm={() => setShowContractForm(true)} form={showContractForm && <ContractForm onClose={() => setShowContractForm(false)} onSubmit={addContract} />} />}
      {page === 'Cobranças' && <Charges items={charges} registerReceipt={registerReceipt} openForm={() => setShowChargeForm(true)} form={showChargeForm && <ChargeForm onClose={() => setShowChargeForm(false)} onSubmit={addCharge} />} />}
      {page === 'Conciliação' && <Reconciliation items={bank} confirm={confirmBankItem} importStatement={importStatement} inform={inform} />}
      {page === 'Despesas' && <Expenses items={expenses} openForm={() => setShowExpenseForm(true)} form={showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} onSubmit={addExpense} />} />}
      {page === 'Manutenções' && <Maintenances items={maintenances} openForm={() => setShowMaintenanceForm(true)} form={showMaintenanceForm && <MaintenanceForm onClose={() => setShowMaintenanceForm(false)} onSubmit={addMaintenance} />} />}
      {page === 'Relatórios' && <Reports charges={charges} expenses={expenses} units={initialUnits} />}
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

function Contracts({ items, openForm, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">CONTRATOS</p><h2>Contratos ativos</h2></div><button className="solid-small" onClick={openForm}>Novo contrato</button></div><Table headers={['Unidade', 'Inquilino', 'Início', 'Fim previsto', 'Aluguel', 'Situação']} rows={items.map((item) => [item.unit, item.tenant, item.start, item.end, money(item.rent), <span className="badge pago">{item.status}</span>])} /></section></>; }

function Charges({ items, registerReceipt, openForm, form }) {
  const [filters, setFilters] = useState({ start: '', end: '', tenant: '' });
  const filtered = items.filter((item) => inRange(dateToIso(item.due), filters.start, filters.end) && (!filters.tenant || item.tenant === filters.tenant));
  return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">ALUGUÉIS · SET/2026</p><h2>Cobranças</h2></div><button className="solid-small" onClick={openForm}>Nova cobrança</button></div><FilterBar filters={filters} setFilters={setFilters} tenants={items.map((item) => item.tenant)} /><p className="filter-result">{filtered.length} cobrança(s) encontrada(s)</p><Table headers={['Unidade', 'Inquilino', 'Vencimento', 'Valor', 'Situação', 'Recebimento', 'Ação']} rows={filtered.map((item) => [item.unit, item.tenant, item.due, money(item.amount), <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>, item.paidAt || '—', item.status === 'Pago' ? <span className="muted">Confirmado</span> : <button className="table-action" onClick={() => registerReceipt(item.id)}>Registrar recebimento</button>])} /></section></>;
}

function Reconciliation({ items, confirm, importStatement, inform }) { return <section className="card"><div className="card-title"><div><p className="eyebrow">BANCO INTER</p><h2>Conciliação bancária</h2><small>Importe um CSV com as colunas Data, Descrição e Valor. As transações entram como pendentes para conferência.</small></div><label className="solid-small file-input">Selecionar CSV<input type="file" accept=".csv,text/csv" onChange={importStatement} /></label></div><div className="reconciliation-list">{items.map((item) => <article className="bank-row" key={item.id}><div className={`direction ${item.direction === 'Crédito' ? 'credit' : 'debit'}`}>{item.direction === 'Crédito' ? '↓' : '↑'}</div><div className="bank-main"><b>{item.description}</b><small>{item.date} · {item.direction}</small></div><div className="suggestion">{item.suggestion ? <><small>Sugestão</small><b>{item.suggestion}</b></> : <span className="badge pendente">Sem sugestão</span>}</div><div className="right"><b>{money(item.amount)}</b><span className={`badge ${statusClass(item.state)}`}>{item.state}</span></div>{item.state === 'Sugerida' && <button className="solid-small" onClick={() => confirm(item.id)}>Confirmar</button>}</article>)}</div></section>; }

function Expenses({ items, openForm, form }) {
  const [filters, setFilters] = useState({ start: '', end: '', category: '' });
  const filtered = items.filter((item) => inRange(dateToIso(item.date), filters.start, filters.end) && (!filters.category || item.category === filters.category));
  return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">PAGAMENTOS E MANUTENÇÃO</p><h2>Despesas</h2></div><button className="solid-small" onClick={openForm}>Lançar despesa</button></div><FilterBar filters={filters} setFilters={setFilters} categories={items.map((item) => item.category)} /><p className="filter-result">{filtered.length} despesa(s) encontrada(s) · {money(filtered.reduce((total, item) => total + item.amount, 0))}</p><Table headers={['Data', 'Descrição', 'Fornecedor', 'Referência', 'Categoria', 'Valor', 'Situação']} rows={filtered.map((item) => [item.date, item.description, item.supplier, item.unit, item.category, money(item.amount), <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>])} /></section></>;
}

function Maintenances({ items, openForm, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">OPERAÇÃO DO PRÉDIO</p><h2>Manutenções</h2><small>Acompanhe solicitações, custo estimado e valor efetivamente gasto.</small></div><button className="solid-small" onClick={openForm}>Nova manutenção</button></div><Table headers={['Abertura', 'Solicitação', 'Referência', 'Prioridade', 'Fornecedor', 'Estimado', 'Real', 'Situação']} rows={items.map((item) => [item.openedAt, item.title, item.unit, <span className={`badge priority-${statusClass(item.priority)}`}>{item.priority}</span>, item.supplier, money(item.estimated), money(item.actual), <span className={`badge maintenance-${statusClass(item.status)}`}>{item.status}</span>])} /></section></>; }

function Reports({ charges, expenses, units }) {
  const [filters, setFilters] = useState({ start: '', end: '', tenant: '', category: '' });
  const filteredCharges = charges.filter((item) => inRange(dateToIso(item.paidAt || item.due), filters.start, filters.end) && (!filters.tenant || item.tenant === filters.tenant));
  const filteredExpenses = expenses.filter((item) => inRange(dateToIso(item.date), filters.start, filters.end) && (!filters.category || item.category === filters.category));
  const income = filteredCharges.filter((item) => item.status === 'Pago').reduce((total, item) => total + item.amount, 0);
  const expenseTotal = filteredExpenses.reduce((total, item) => total + item.amount, 0);
  const openTotal = filteredCharges.filter((item) => item.status !== 'Pago').reduce((total, item) => total + item.amount, 0);
  const reportUnits = units.filter((unit) => unit.rent && (!filters.tenant || filteredCharges.some((charge) => charge.unit === unit.name)));
  return <><section className="card report-filter"><div className="card-title"><div><p className="eyebrow">ANÁLISE FINANCEIRA</p><h2>Filtros do relatório</h2></div></div><FilterBar filters={filters} setFilters={setFilters} tenants={charges.map((item) => item.tenant)} categories={expenses.map((item) => item.category)} /></section><section className="metric-grid"><Metric label="Aluguel recebido" value={money(income)} hint="Base caixa" tone="green" /><Metric label="Despesas pagas" value={money(expenseTotal)} hint="Base caixa" tone="orange" /><Metric label="Resultado do mês" value={money(income - expenseTotal)} hint="Cauções excluídas" tone="blue" /><Metric label="Em aberto" value={money(openTotal)} hint={`${filteredCharges.filter((item) => item.status !== 'Pago').length} cobrança(s)`} tone="purple" /></section><section className="card"><div className="card-title"><div><p className="eyebrow">SETEMBRO DE 2026</p><h2>Resultado por unidade</h2></div><button className="plain-small">Exportar CSV</button></div><Table headers={['Unidade', 'Aluguel previsto', 'Manutenção', 'Resultado']} rows={reportUnits.map((unit) => { const maintenance = filteredExpenses.filter((item) => item.unit === unit.name).reduce((total, item) => total + item.amount, 0); return [unit.name, money(unit.rent), money(maintenance), money(unit.rent - maintenance)]; })} /></section></>;
}

function FilterBar({ filters, setFilters, tenants = [], categories = [] }) {
  const update = (key, value) => setFilters({ ...filters, [key]: value });
  const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  return <div className="filter-bar"><label>De<input type="date" value={filters.start} onChange={(event) => update('start', event.target.value)} /></label><label>Até<input type="date" value={filters.end} onChange={(event) => update('end', event.target.value)} /></label>{tenants.length > 0 && <label>Inquilino<select value={filters.tenant || ''} onChange={(event) => update('tenant', event.target.value)}><option value="">Todos</option>{unique(tenants).map((tenant) => <option key={tenant}>{tenant}</option>)}</select></label>}{categories.length > 0 && <label>Categoria<select value={filters.category || ''} onChange={(event) => update('category', event.target.value)}><option value="">Todas</option>{unique(categories).map((category) => <option key={category}>{category}</option>)}</select></label>}<button className="clear-filter" type="button" onClick={() => setFilters({ start: '', end: '', tenant: '', category: '' })}>Limpar filtros</button></div>;
}

function Table({ headers, rows }) { return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>; }

function Modal({ title, children, onClose }) { return <div className="modal-backdrop"><section className="modal"><div className="modal-head"><h2>{title}</h2><button onClick={onClose}>×</button></div>{children}</section></div>; }
function ChargeForm({ onClose, onSubmit }) { return <Modal title="Nova cobrança" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Unidade<select name="unit" required>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Inquilino<input name="tenant" required placeholder="Nome do inquilino" /></label><label>Vencimento<input name="due" required placeholder="dd/mm/aaaa" /></label><label>Valor<input name="amount" required type="number" min="0" step="0.01" placeholder="0,00" /></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar cobrança</button></div></form></Modal>; }
function ExpenseForm({ onClose, onSubmit }) { return <Modal title="Lançar despesa" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Data<input name="date" required placeholder="dd/mm/aaaa" /></label><label>Valor<input name="amount" required type="number" min="0" step="0.01" placeholder="0,00" /></label><label className="full">Descrição<input name="description" required placeholder="O que foi pago?" /></label><label>Fornecedor ou pessoa<input name="supplier" required placeholder="Nome" /></label><label>Referência<select name="unit"><option>Área comum</option>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Categoria<select name="category"><option>Manutenção</option><option>Serviços</option><option>Material</option><option>Utilidades</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar despesa</button></div></form></Modal>; }
function ContractForm({ onClose, onSubmit }) { return <Modal title="Novo contrato" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Unidade<select name="unit" required>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Inquilino titular<input name="tenant" required placeholder="Nome completo" /></label><label>Início<input name="start" required placeholder="dd/mm/aaaa" /></label><label>Fim previsto<input name="end" required placeholder="dd/mm/aaaa" /></label><label>Aluguel mensal<input name="rent" required type="number" min="0" step="0.01" placeholder="0,00" /></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar contrato</button></div></form></Modal>; }
function MaintenanceForm({ onClose, onSubmit }) { return <Modal title="Nova manutenção" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Data de abertura<input name="openedAt" required placeholder="dd/mm/aaaa" /></label><label>Referência<select name="unit"><option>Área comum</option>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label className="full">Solicitação<input name="title" required placeholder="Descreva o problema ou serviço" /></label><label>Prioridade<select name="priority"><option>Baixa</option><option>Média</option><option>Alta</option></select></label><label>Fornecedor ou responsável<input name="supplier" placeholder="A definir" /></label><label>Custo estimado<input name="estimated" type="number" min="0" step="0.01" placeholder="0,00" /></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar manutenção</button></div></form></Modal>; }

createRoot(document.getElementById('root')).render(<App />);
