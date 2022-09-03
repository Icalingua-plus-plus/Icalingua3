import inquirer from 'inquirer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { keyPairPath } from './utils/pathUtils.js';

/** 输出私钥 */
const logPrivKey = (privateKey: crypto.webcrypto.JsonWebKey) =>
  console.log('Your private key is:\n', JSON.stringify(privateKey));

/** 生成密钥对 */
const genKey = async () => {
  let existKeyPair;
  try {
    await fs.open(keyPairPath, 'r');
    existKeyPair = true;
  } catch (e) {
    existKeyPair = false;
  }
  if (existKeyPair) {
    const answer = await inquirer.prompt<{ answer: boolean }>({
      type: 'confirm',
      name: 'answer',
      message: 'The key pair is already exist, regenerate?',
      default: false,
    });
    if (!answer.answer) {
      return;
    }
  }
  const keyPair = await crypto.webcrypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-521' },
    true,
    ['sign', 'verify'],
  );
  const [publicKey, privateKey] = await Promise.all([
    crypto.webcrypto.subtle.exportKey('jwk', keyPair.publicKey),
    crypto.webcrypto.subtle.exportKey('jwk', keyPair.privateKey),
  ]);
  await fs.writeFile(keyPairPath, JSON.stringify({ publicKey, privateKey }, null, 2));
  console.log('Key pair generated.');
  logPrivKey(privateKey);
};

/** 查看私钥 */
const viewKey = async () => {
  let keyPairStr;
  try {
    keyPairStr = (await fs.readFile(keyPairPath)).toString();
  } catch (e) {
    console.error('Key pair not found.');
    return;
  }
  try {
    const keyPair: {
      publicKey: crypto.webcrypto.JsonWebKey;
      privateKey: crypto.webcrypto.JsonWebKey;
    } = JSON.parse(keyPairStr);
    await Promise.all([
      crypto.webcrypto.subtle.importKey(
        'jwk',
        keyPair.privateKey,
        { name: 'ECDSA', namedCurve: 'P-521' },
        true,
        ['sign'],
      ),
      crypto.webcrypto.subtle.importKey(
        'jwk',
        keyPair.publicKey,
        { name: 'ECDSA', namedCurve: 'P-521' },
        true,
        ['verify'],
      ),
    ]);
    console.log('Key pair found.');
    logPrivKey(keyPair.privateKey);
  } catch (e) {
    console.error('Your key pair is invalid, please regenerate one.');
  }
};

const answers = await inquirer.prompt<{ answer: 'genKeyPair' | 'viewKey' | 'exit' }>({
  type: 'list',
  name: 'answer',
  message: 'What do you want to do?',
  choices: [
    { name: 'Generate key pair', value: 'genKeyPair' },
    { name: 'View my private key', value: 'viewKey' },
    { name: 'Exit', value: 'exit' },
  ],
});

switch (answers.answer) {
  case 'genKeyPair':
    await genKey();
    break;
  case 'viewKey':
    await viewKey();
    break;
  default:
    break;
}
