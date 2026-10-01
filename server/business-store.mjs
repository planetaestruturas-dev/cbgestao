import { DatabaseSync } from 'node:sqlite';
import { chmodSync } from 'node:fs';

const databaseFile = process.env.BUSINESS_DATABASE_FILE || '/data/cbgestao.sqlite';
process.umask(0o077);
const database = new DatabaseSync(databaseFile);
chmodSync(databaseFile, 0o600);

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

const getStatement = database.prepare('SELECT value FROM business_data WHERE key = ?');
const saveStatement = database.prepare(`
  INSERT INTO business_data (key, value, updated_at, updated_by)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by
`);
const auditStatement = database.prepare('INSERT INTO business_audit (changed_at, username, data_key) VALUES (?, ?, ?)');

export function readBusinessValue(key) {
  const row = getStatement.get(key);
  return row ? JSON.parse(row.value) : undefined;
}

export function saveBusinessValue(key, value, username) {
  const changedAt = new Date().toISOString();
  database.exec('BEGIN IMMEDIATE');
  try {
    saveStatement.run(key, JSON.stringify(value), changedAt, username);
    auditStatement.run(changedAt, username, key);
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

export function businessHealth() {
  return database.prepare('PRAGMA integrity_check').get().integrity_check === 'ok';
}
