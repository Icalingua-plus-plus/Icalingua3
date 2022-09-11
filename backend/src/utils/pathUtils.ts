import path from 'path';
import fs from 'node:fs';

const root = path.join(path.dirname(import.meta.url.replace('file:///', '')), '../../../');
export const staticPath = path.join(root, 'static');

const dataPath = path.join(root, 'data');
fs.mkdirSync(dataPath, { recursive: true });

export const logPath = path.join(root, 'log');
fs.mkdirSync(logPath, { recursive: true });

export const oicqDataPath = path.resolve(dataPath, 'oicq');
export const sqliteDbPath = path.resolve(dataPath, 'Icalingua3.db');
export const configPath = path.resolve(dataPath, 'config.json');
export const keyPairPath = path.resolve(dataPath, 'keyPair.json');
