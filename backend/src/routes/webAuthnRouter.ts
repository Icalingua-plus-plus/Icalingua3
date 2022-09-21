import { IGetKeysRes } from '@icalingua/types/http/IGetKeysRes.js';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import {
  AuthenticationCredentialJSON,
  AuthenticatorTransportFuture,
  PublicKeyCredentialDescriptorFuture,
  RegistrationCredentialJSON,
} from '@simplewebauthn/typescript-types';
import { FastifyInstance } from 'fastify';
import { nanoid } from 'nanoid';
import Authenticator from '../database/entities/Authenticator.js';
import { getEM } from '../database/storageProvider.js';
import needAuth from '../plugins/needAuth.js';
import configProvider from '../services/configProvider.js';
import logger from '../utils/logger.js';
import passwordSecretUtils from '../utils/passwordSecretUtils.js';

// Human-readable title for your website
const rpName = 'Icalingua';
// A unique identifier for your website
const rpID = 'localhost';
// The URL at which registrations and authentications should occur
const origin = `http://${rpID}:5173`;

/** 处理 Web Authentication 注册 */
const registerRouter = async (server: FastifyInstance) => {
  /** 需要有 token 才能注册 WebAuthn */
  server.register(needAuth);
  /** 注册时的第一个请求 */
  server.get('/', async (req, res) => {
    const authenticators = await getEM().find(Authenticator, {});
    const options = generateRegistrationOptions({
      rpName,
      rpID,
      userID: 'Icalingua3',
      userName: 'Icalingua3',
      attestationType: 'direct',
      excludeCredentials: authenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: 'public-key',
      })),
    });
    passwordSecretUtils.setCurrentChallenge(options.challenge);
    res.send(options);
  });
  /** 注册时的第二个请求 */
  server.post<{ Body: RegistrationCredentialJSON }>('/', async (req, res) => {
    const expectedChallenge = passwordSecretUtils.getCurrentChallenge();
    let verification;
    try {
      verification = await verifyRegistrationResponse({
        credential: req.body,
        expectedChallenge,
        expectedOrigin: configProvider.config.webAuthnOrigin || origin,
        expectedRPID: rpID,
      });
    } catch (e) {
      logger.error(`${(e as Error).name}${(e as Error).stack}`);
      return res.status(400).send(e);
    }
    if (!verification.verified) return res.status(400).send('Verification failed');
    const registrationInfo = verification.registrationInfo!;
    const authenticator = new Authenticator({
      credentialID: registrationInfo.credentialID,
      credentialPublicKey: registrationInfo.credentialPublicKey,
      counter: registrationInfo.counter,
      credentialDeviceType: registrationInfo.credentialDeviceType,
      credentialBackedUp: registrationInfo.credentialBackedUp,
      aaguid: registrationInfo.aaguid,
      attestationObject: registrationInfo.attestationObject,
    });
    await getEM().persistAndFlush(authenticator);
    const token = server.jwt.sign({ id: nanoid(), webAuthn: true });
    passwordSecretUtils.setCurrentChallenge('');
    return res.send(token);
  });
};

/** 处理 Web Authentication 登录 */
const authenticationRouter = async (server: FastifyInstance) => {
  server.get('/', async (req, res) => {
    const authenticators = await getEM().find(Authenticator, {});
    const options = generateAuthenticationOptions({
      // Require users to use a previously-registered authenticator
      allowCredentials: authenticators.map(
        (authenticator) =>
          ({
            id: authenticator.credentialID,
            type: 'public-key',
            // Optional
            transports: authenticator.transports || undefined,
          } as PublicKeyCredentialDescriptorFuture),
      ),
      userVerification: 'discouraged',
    });
    passwordSecretUtils.setCurrentChallenge(options.challenge);
    res.send(options);
  });
  server.post<{ Body: AuthenticationCredentialJSON }>('/', async (req, res) => {
    const em = getEM();
    const authenticator = await em.findOne(Authenticator, {
      credentialID: Buffer.from(req.body.id, 'base64'),
    });
    if (!authenticator) return res.status(401).send('Unauthorized');
    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        credential: req.body,
        expectedChallenge: passwordSecretUtils.getCurrentChallenge(),
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: {
          credentialID: authenticator.credentialID,
          credentialPublicKey: authenticator.credentialPublicKey,
          counter: authenticator.counter,
          transports:
            (authenticator.transports as AuthenticatorTransportFuture[] | null) || undefined,
        },
      });
    } catch (e) {
      logger.error(`${(e as Error).name}${(e as Error).stack}`);
      return res.status(400).send(e);
    }
    if (!verification.verified) return res.status(400).send('Verification failed');
    const token = server.jwt.sign({ id: nanoid(), webAuthn: true });
    res.send(token);
    passwordSecretUtils.setCurrentChallenge('');
    authenticator.counter = verification.authenticationInfo.newCounter;
    authenticator.lastUsedAt = new Date();
    return em.flush();
  });
};

/** 管理存储的密钥 */
const manageRouter = async (server: FastifyInstance) => {
  server.register(needAuth);
  /** 获取目前存储的所有密钥 */
  server.get('/', async (req, res) => {
    const authenticators = await getEM().find(Authenticator, {});
    res.send(
      authenticators.map((authenticator) => {
        const httpAuthenticator: IGetKeysRes = {
          counter: authenticator.counter,
          credentialDeviceType: authenticator.credentialDeviceType,
          credentialBackedUp: authenticator.credentialBackedUp,
          aaguid: authenticator.aaguid,
          attestationObject: authenticator.attestationObject?.toString('base64'),
          lastUsedAt: Number(authenticator.lastUsedAt),
          createdAt: Number(authenticator.createdAt),
          credentialID: authenticator.credentialID.toString('base64'),
        };
        return httpAuthenticator;
      }),
    );
  });
  /** 根据 credential ID 删除密钥 */
  server.delete<{ Querystring: { credentialID: string } }>('/', async (req, res) => {
    const em = getEM();
    const authenticator = await em.findOne(Authenticator, {
      credentialID: Buffer.from(decodeURIComponent(req.query.credentialID), 'base64'),
    });
    if (!authenticator) return res.status(404).send('Not Found');
    await em.removeAndFlush(authenticator);
    return res.status(204).send();
  });
};

/** 处理 Web Authentication 相关的内容 */
const webAuthnRouter = async (server: FastifyInstance) => {
  server.register(registerRouter, { prefix: '/register' });
  server.register(authenticationRouter, { prefix: '/login' });
  server.register(manageRouter, { prefix: '/manage' });
};

export default webAuthnRouter;
