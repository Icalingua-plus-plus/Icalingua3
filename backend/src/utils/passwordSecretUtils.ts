import bcrypt from '@node-rs/bcrypt';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import logger from './logger.js';
import { passwordSecretPath } from './pathUtils.js';

let secret = '';
let password = '';
let lastLogOutTime = 0;

/** 保存密钥 */
const saveKey = async () => {
  const passwordSecretStr = JSON.stringify({ secret, password, lastLogOutTime });
  await fs.writeFile(passwordSecretPath, passwordSecretStr);
};

/** 获取密钥 */
const loadKey = async () => {
  try {
    const passwordSecretStr = await fs.readFile(passwordSecretPath, 'utf-8');
    try {
      ({ secret, password, lastLogOutTime } = JSON.parse(passwordSecretStr));
      if (!secret || password === undefined) throw new Error('Invalid password and secret file');
    } catch (e) {
      logger.error(
        'Password and secret file is invalid, please delete it and restart the program.',
      );
      throw e;
    }
  } catch (e) {
    /* 处理第一次启动（没有文件）时的逻辑 */
    logger.warn('Password and secret file not found, initilizing……');
    secret = crypto.webcrypto.randomUUID();
    password = '';
    lastLogOutTime = 0;
    await saveKey();
  }
  return { secret, password, lastLogOutTime };
};

/** 修改密码
 * @param newPassword 新密码
 */
const changePassword = async (newPassword: string) => {
  password = await bcrypt.hash(newPassword);
  await saveKey();
};

/** 验证密码
 * @param passwordToVerify 待验证的密码
 * @returns 验证结果，true 为验证成功，false 为验证失败
 */
const verifyPasssword = async (passwordToVerify: string) => {
  if (!password) {
    await changePassword(passwordToVerify);
    return true;
  }
  const result = await bcrypt.compare(passwordToVerify, password);
  return result;
};

/** 比较时间 */
const isValid = (iat: number) => iat >= lastLogOutTime;

/** 退出登录后，将上次退出的时间设为现在 */
const logout = async () => {
  lastLogOutTime = Math.floor(Date.now() / 1000);
  await saveKey();
};

export default {
  loadKey,
  saveKey,
  changePassword,
  verifyPasssword,
  isValid,
  logout,
};
