import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import logger from './logger.js';
import { keyPairPath } from './pathUtils.js';

/** 获取密钥 */
const getKey = async () => {
  let keyPairStr;
  try {
    keyPairStr = await fs.readFile(keyPairPath, 'utf-8');
  } catch (e) {
    logger.error('Key pair not found. Please generate it first.');
    logger.info('Use `pnpm keyctl` and follow the guide to generate a new key pair.');
    throw new Error('Key pair not found. Please generate it first.');
  }
  try {
    const keyPair: {
      publicKey: crypto.webcrypto.JsonWebKey;
      privateKey: crypto.webcrypto.JsonWebKey;
    } = JSON.parse(keyPairStr);
    const [publicKey, privateKey] = await Promise.all([
      crypto.webcrypto.subtle.importKey(
        'jwk',
        keyPair.publicKey,
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['verify'],
      ),
      crypto.webcrypto.subtle.importKey(
        'jwk',
        keyPair.privateKey,
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['sign'],
      ),
    ]);
    return { publicKey, privateKey };
  } catch (e) {
    logger.error('Your key pair is invalid, please regenerate one.');
    throw new Error('Your key pair is invalid, please regenerate one.');
  }
};

export default { getKey };
