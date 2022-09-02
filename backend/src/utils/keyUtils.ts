import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { keyPairPath } from './pathUtils.js';

const getKey = async () => {
  let keyPairStr;
  try {
    keyPairStr = (await fs.readFile(keyPairPath)).toString();
  } catch (e) {
    console.error('Key pair not found. Please generate it first.');
    console.log('Use `pnpm keyctl` and follow the guide to generate a new key pair.');
    return process.exit(1);
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
        { name: 'ECDSA', namedCurve: 'P-521' },
        true,
        ['verify'],
      ),
      crypto.webcrypto.subtle.importKey(
        'jwk',
        keyPair.privateKey,
        { name: 'ECDSA', namedCurve: 'P-521' },
        true,
        ['sign'],
      ),
    ]);
    return { publicKey, privateKey };
  } catch (e) {
    console.error('Your key pair is invalid, please regenerate one.');
    return process.exit(1);
  }
};

export default { getKey };
