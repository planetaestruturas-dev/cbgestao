import { makeUser, profiles, readStore, writeStore } from './auth-store.mjs';
const [name, username, email, pin] = process.argv.slice(2);
const store = await readStore();
if (store.users.length) throw new Error('Administrador já provisionado.');
store.profiles = store.profiles || profiles;
store.users.push(makeUser({ name, username, email, pin, role: 'Administrador Geral' }));
await writeStore(store);
console.log('Administrador Geral provisionado.');
