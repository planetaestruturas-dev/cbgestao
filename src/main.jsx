import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './mobile.css';

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

function App() {
  const [page, setPage] = useState('Visão geral');
  const [charges, setCharges] = useState(initialCharges);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [bank, setBank] = useState(bankItems);
  const [notice, setNotice] = useState('');
  const [showChargeForm, setShowChargeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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

  const menu = ['Visão geral', 'Unidades', 'Contratos', 'Cobranças', 'Conciliação', 'Despesas', 'Relatórios'];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">CB</span><span>Gestão<br /><b>Kitnets</b></span></div>
      <nav>{menu.map((item) => <button className={page === item ? 'nav-item active' : 'nav-item'} key={item} onClick={() => navigate(item)}>{item}</button>)}</nav>
      <div className="sidebar-bottom"><span className="avatar">F</span><div><b>Fabi</b><small>Administrador</small></div></div>
    </aside>
    <main className="main">
      <header><div><p className="eyebrow">SETEMBRO DE 2026</p><h1>{page}</h1></div><button className="import-button" onClick={() => navigate('Conciliação')}>Importar extrato</button></header>
      {notice && <div className="toast">{notice}</div>}
      {page === 'Visão geral' && <Dashboard income={income} expenses={paidExpenses} openCharges={openCharges} occupancy={occupancy} navigate={navigate} />}
      {page === 'Unidades' && <Units />}
      {page === 'Contratos' && <Contracts />}
      {page === 'Cobranças' && <Charges items={charges} openForm={() => setShowChargeForm(true)} form={showChargeForm && <ChargeForm onClose={() => setShowChargeForm(false)} onSubmit={addCharge} />} />}
      {page === 'Conciliação' && <Reconciliation items={bank} confirm={confirmBankItem} inform={inform} />}
      {page === 'Despesas' && <Expenses items={expenses} openForm={() => setShowExpenseForm(true)} form={showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} onSubmit={addExpense} />} />}
      {page === 'Relatórios' && <Reports income={income} expenses={paidExpenses} units={initialUnits} />}
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

function Contracts() { const active = initialUnits.filter((unit) => unit.status === 'Ocupada'); return <section className="card"><div className="card-title"><div><p className="eyebrow">CONTRATOS</p><h2>Contratos ativos</h2></div><button className="solid-small">Novo contrato</button></div><Table headers={['Unidade', 'Inquilino', 'Início', 'Aluguel', 'Situação']} rows={active.map((unit) => [unit.name, unit.tenant, '2026', money(unit.rent), <span className="badge pago">Ativo</span>])} /></section>; }

function Charges({ items, openForm, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">ALUGUÉIS · SET/2026</p><h2>Cobranças</h2></div><button className="solid-small" onClick={openForm}>Nova cobrança</button></div><Table headers={['Unidade', 'Inquilino', 'Vencimento', 'Valor', 'Situação', 'Recebimento']} rows={items.map((item) => [item.unit, item.tenant, item.due, money(item.amount), <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>, item.paidAt || '—'])} /></section></>; }

function Reconciliation({ items, confirm, inform }) { return <section className="card"><div className="card-title"><div><p className="eyebrow">BANCO INTER</p><h2>Conciliação bancária</h2><small>Protótipo: a importação de arquivo real será implementada com revisão antes da gravação.</small></div><button className="solid-small" onClick={() => inform('Nesta tela será aberto o importador CSV/OFX após validarmos o formato do extrato do Inter.')}>Selecionar extrato</button></div><div className="reconciliation-list">{items.map((item) => <article className="bank-row" key={item.id}><div className={`direction ${item.direction === 'Crédito' ? 'credit' : 'debit'}`}>{item.direction === 'Crédito' ? '↓' : '↑'}</div><div className="bank-main"><b>{item.description}</b><small>{item.date} · {item.direction}</small></div><div className="suggestion">{item.suggestion ? <><small>Sugestão</small><b>{item.suggestion}</b></> : <span className="badge pendente">Sem sugestão</span>}</div><div className="right"><b>{money(item.amount)}</b><span className={`badge ${statusClass(item.state)}`}>{item.state}</span></div>{item.state === 'Sugerida' && <button className="solid-small" onClick={() => confirm(item.id)}>Confirmar</button>}</article>)}</div></section>; }

function Expenses({ items, openForm, form }) { return <>{form}<section className="card"><div className="card-title"><div><p className="eyebrow">PAGAMENTOS E MANUTENÇÃO</p><h2>Despesas</h2></div><button className="solid-small" onClick={openForm}>Lançar despesa</button></div><Table headers={['Data', 'Descrição', 'Fornecedor', 'Referência', 'Categoria', 'Valor', 'Situação']} rows={items.map((item) => [item.date, item.description, item.supplier, item.unit, item.category, money(item.amount), <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>])} /></section></>; }

function Reports({ income, expenses, units }) { const byUnit = units.filter((unit) => unit.rent).map((unit) => ({ ...unit, result: unit.rent - (unit.id === 3 ? 180 : 0) })); return <><section className="metric-grid"><Metric label="Aluguel recebido" value={money(income)} hint="Base caixa" tone="green" /><Metric label="Despesas pagas" value={money(expenses)} hint="Base caixa" tone="orange" /><Metric label="Resultado do mês" value={money(income - expenses)} hint="Cauções excluídas" tone="blue" /><Metric label="Em aberto" value={money(1200)} hint="2 cobranças" tone="purple" /></section><section className="card"><div className="card-title"><div><p className="eyebrow">SETEMBRO DE 2026</p><h2>Resultado por unidade</h2></div><button className="plain-small">Exportar CSV</button></div><Table headers={['Unidade', 'Aluguel previsto', 'Manutenção', 'Resultado']} rows={byUnit.map((unit) => [unit.name, money(unit.rent), money(unit.id === 3 ? 180 : 0), money(unit.result)])} /></section></>; }

function Table({ headers, rows }) { return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>; }

function Modal({ title, children, onClose }) { return <div className="modal-backdrop"><section className="modal"><div className="modal-head"><h2>{title}</h2><button onClick={onClose}>×</button></div>{children}</section></div>; }
function ChargeForm({ onClose, onSubmit }) { return <Modal title="Nova cobrança" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Unidade<select name="unit" required>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Inquilino<input name="tenant" required placeholder="Nome do inquilino" /></label><label>Vencimento<input name="due" required placeholder="dd/mm/aaaa" /></label><label>Valor<input name="amount" required type="number" min="0" step="0.01" placeholder="0,00" /></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar cobrança</button></div></form></Modal>; }
function ExpenseForm({ onClose, onSubmit }) { return <Modal title="Lançar despesa" onClose={onClose}><form onSubmit={onSubmit} className="form-grid"><label>Data<input name="date" required placeholder="dd/mm/aaaa" /></label><label>Valor<input name="amount" required type="number" min="0" step="0.01" placeholder="0,00" /></label><label className="full">Descrição<input name="description" required placeholder="O que foi pago?" /></label><label>Fornecedor ou pessoa<input name="supplier" required placeholder="Nome" /></label><label>Referência<select name="unit"><option>Área comum</option>{initialUnits.map((unit) => <option key={unit.id}>{unit.name}</option>)}</select></label><label>Categoria<select name="category"><option>Manutenção</option><option>Serviços</option><option>Material</option><option>Utilidades</option></select></label><div className="form-actions"><button type="button" className="plain-small" onClick={onClose}>Cancelar</button><button className="solid-small">Salvar despesa</button></div></form></Modal>; }

createRoot(document.getElementById('root')).render(<App />);
