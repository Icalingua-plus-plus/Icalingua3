import crypto from 'node:crypto';
import { TextEncoder } from 'node:util';
import keyUtils from './keyUtils.js';

/** 验证客户端 */
const verifyClient = async (signature: Uint8Array, challange: string) => {
  const { publicKey } = await keyUtils.getKey();
  const textEncoder = new TextEncoder();
  const res = await crypto.webcrypto.subtle.verify(
    { name: 'ECDSA', hash: { name: 'SHA-512' } },
    publicKey,
    signature,
    textEncoder.encode(challange),
  );
  return res;
};

export default verifyClient;
