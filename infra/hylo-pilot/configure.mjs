import {generateKeyPairSync, randomBytes} from 'node:crypto';
import {writeFile, access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const source=process.argv[2] && path.resolve(process.argv[2]);
if (!source || /[\r\n]/.test(source)) throw new Error('Pass the absolute path to the Hylo source checkout.');
await access(path.join(source,'apps/backend/migrations/schema.sql'));
const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{type:'pkcs1',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}});
const unixPath=value=>value.replaceAll('\\','/');
const values={HYLO_SOURCE:unixPath(source),HYLO_DOCKERFILE:unixPath(path.join(here,'Dockerfile')),HYLO_DB_DOCKERFILE:unixPath(path.join(here,'Dockerfile.database')),HYLO_DB_PASSWORD:randomBytes(24).toString('hex'),HYLO_COOKIE_SECRET:randomBytes(32).toString('hex'),HYLO_JWT_SECRET:randomBytes(32).toString('hex'),HYLO_OIDC_KEY:Buffer.from(privateKey).toString('base64')};
await writeFile(path.join(here,'.env'),Object.entries(values).map(([key,value])=>`${key}=${value}`).join('\n')+'\n',{flag:'wx',mode:0o600});
console.log('Created a local, Git-ignored pilot configuration. Keep it private.');
