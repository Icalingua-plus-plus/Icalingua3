import path from 'path';
import fs from 'node:fs';
import os from 'node:os';

const replaceStr = os.platform() === 'win32' ? 'file:///' : 'file://';
const fileUrl = import.meta.url.replace(replaceStr, '');
const root = path.join(path.dirname(fileUrl), '../../../');

export const staticPath = path.join(root, 'static');
const migrationPath = path.join(root, 'backend', 'src', 'database', 'migrations');
export const sqliteMigrationPath = path.resolve(migrationPath, 'sqlite');

const dataPath = path.join(root, 'data');
fs.mkdirSync(dataPath, { recursive: true });

export const logPath = path.resolve(root, 'log');
fs.mkdirSync(logPath, { recursive: true });

export const oicqDataPath = path.resolve(dataPath, 'oicq');
export const sqliteDbPath = path.resolve(dataPath, 'Icalingua3.db');
export const configPath = path.resolve(dataPath, 'config.json');
export const passwordSecretPath = path.resolve(dataPath, 'passwordSecret.json');
