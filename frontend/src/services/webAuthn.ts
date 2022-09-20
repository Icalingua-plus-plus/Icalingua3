import {
  AuthenticationCredentialJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationCredentialJSON,
} from '@simplewebauthn/typescript-types';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import axiosClient from './axiosClient';

/** WebAuthn 第一个注册请求 */
const register1 = async () => {
  const res = await axiosClient.client.get<PublicKeyCredentialCreationOptionsJSON>(
    '/webauthn/register',
  );
  return res.data;
};

/** WebAuthn 第二个注册请求 */
const register2 = async (body: RegistrationCredentialJSON) => {
  const res = await axiosClient.client.post<string>('/webauthn/register', body);
  return res.data;
};

/** WebAuthn 第一个登录请求 */
const login1 = async () => {
  const res = await axiosClient.client.get<PublicKeyCredentialRequestOptionsJSON>(
    '/webauthn/login',
  );
  return res.data;
};

/** WebAuthn 第二个登录请求 */
const login2 = async (body: AuthenticationCredentialJSON) => {
  const res = await axiosClient.client.post<string>('/webauthn/login', body);
  return res.data;
};

/** WebAuthn 注册
 * @return token
 */
export const register = async () => {
  const res1 = await register1();
  let attResp;
  try {
    // Pass the options to the authenticator and wait for a response
    attResp = await startRegistration(res1);
  } catch (e) {
    console.error(e);
    throw e;
  }
  const res2 = await register2(attResp);
  return res2;
};

/** WebAuthn 登录
 * @return token
 */
export const login = async () => {
  const res1 = await login1();
  let attResp;
  try {
    // Pass the options to the authenticator and wait for a response
    attResp = await startAuthentication(res1);
  } catch (e) {
    console.error(e);
    throw e;
  }
  const res2 = await login2(attResp);
  return res2;
};
