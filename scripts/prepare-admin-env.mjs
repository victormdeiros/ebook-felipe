import { readFileSync, appendFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
const require = createRequire(new URL('../server/package.json', import.meta.url));
const file = new URL('../.env', import.meta.url);
const values = require('dotenv').parse(readFileSync(file));
const username = values.ADMIN_USERNAME || values.login_admin;
const password = values.ADMIN_PASSWORD || values.Password;
if (!username || !password) throw new Error('Configure usuário e senha no .env da raiz.');
const additions = {};
if (!values.ADMIN_USERNAME) additions.ADMIN_USERNAME = username;
let validHash = false;
if (values.ADMIN_PASSWORD_HASH) {
  try {
    const [salt, hash] = values.ADMIN_PASSWORD_HASH.split(':');
    const expected = Buffer.from(hash, 'hex');
    validHash = expected.length === 64 && timingSafeEqual(expected, scryptSync(password, salt, 64));
  } catch { /* Generate a new hash for the supplied password. */ }
}
if (!validHash) {
  const salt = randomBytes(16).toString('hex');
  additions.ADMIN_PASSWORD_HASH = salt + ':' + scryptSync(password, salt, 64).toString('hex');
}
if (!values.ADMIN_AUTH_SECRET) additions.ADMIN_AUTH_SECRET = randomBytes(32).toString('hex');
if (Object.keys(additions).length) appendFileSync(file, '\n' + Object.entries(additions).map(([key, value]) => key + '=' + JSON.stringify(value)).join('\n') + '\n');
console.log('Credenciais administrativas preparadas no .env ignorado pelo Git.');
