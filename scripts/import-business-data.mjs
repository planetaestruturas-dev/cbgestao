import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const [inputFile, databaseFile = '/data/cbgestao.sqlite'] = process.argv.slice(2);
if (!inputFile) throw new Error('Uso: node import-business-data.mjs dados.json [banco.sqlite]');

const payload = JSON.parse(readFileSync(inputFile, 'utf8'));
const requiredKeys = [
  'cb-gestao:unidades', 'cb-gestao:cobrancas', 'cb-gestao:despesas', 'cb-gestao:extrato',
  'cb-gestao:contratos', 'cb-gestao:manutencoes', 'cb-gestao:distratos', 'cb-gestao:inquilinos',
  'cb-gestao:contas-bancarias', 'cb-gestao:fornecedores', 'cb-gestao:categorias-despesa',
  'cb-gestao:pontos-restauracao',
];
for (const key of requiredKeys) {
  if (!Array.isArray(payload[key])) throw new Error(`Importação inválida: chave ausente ou inválida (${key}).`);
}
if (payload['cb-gestao:unidades'].length !== 12) throw new Error('Importação inválida: são esperadas 12 unidades.');

const database = new DatabaseSync(databaseFile);
database.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = FULL;
  CREATE TABLE IF NOT EXISTS business_data (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    updated_by TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS business_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    changed_at TEXT NOT NULL,
    username TEXT NOT NULL,
    data_key TEXT NOT NULL
  );
`);

const now = new Date().toISOString();
const save = database.prepare(`
  INSERT INTO business_data (key, value, updated_at, updated_by)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by
`);
const audit = database.prepare('INSERT INTO business_audit (changed_at, username, data_key) VALUES (?, ?, ?)');

database.exec('BEGIN IMMEDIATE');
try {
  database.exec('DELETE FROM business_data');
  database.exec('DELETE FROM business_audit');
  for (const key of requiredKeys) {
    save.run(key, JSON.stringify(payload[key]), now, 'importação das planilhas');
    audit.run(now, 'importação das planilhas', key);
  }
  database.exec('COMMIT');
} catch (error) {
  database.exec('ROLLBACK');
  throw error;
}

const integrity = database.prepare('PRAGMA integrity_check').get().integrity_check;
if (integrity !== 'ok') throw new Error(`Falha na integridade após importação: ${integrity}`);
console.log(JSON.stringify({
  ok: true,
  keys: requiredKeys.length,
  units: payload['cb-gestao:unidades'].length,
  contracts: payload['cb-gestao:contratos'].length,
  charges: payload['cb-gestao:cobrancas'].length,
  expenses: payload['cb-gestao:despesas'].length,
  integrity,
}));
