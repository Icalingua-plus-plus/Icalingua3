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
  server.register(needAuth);
  server.get('/', async (req, res) => {
    const authenticators = await getEM().find(Authenticator, {});
    const options = generateRegistrationOptions({
      rpName,
      rpID,
      userID: 'Icalingua3',
      userName: 'Icalingua3',
      attestationType: 'none',
      excludeCredentials: authenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: 'public-key',
      })),
      authenticatorSelection: { requireResidentKey: false, userVerification: 'discouraged' },
    });
    passwordSecretUtils.setCurrentChallenge(options.challenge);
    res.send(options);
  });
  server.post<{ Body: RegistrationCredentialJSON }>('/', async (req, res) => {
    const expectedChallenge = passwordSecretUtils.getCurrentChallenge();
    let verification;
    try {
      verification = await verifyRegistrationResponse({
        credential: req.body,
        expectedChallenge,
        expectedOrigin: origin,
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
    return em.flush();
  });
};

/** 管理存储的密钥 */
const manageRouter = async (server: FastifyInstance) => {
  server.register(needAuth);
};

/** 处理 Web Authentication 相关的内容 */
const webAuthnRouter = async (server: FastifyInstance) => {
  server.register(registerRouter, { prefix: '/register' });
  server.register(authenticationRouter, { prefix: '/login' });
  server.register(manageRouter, { prefix: '/manage' });
};

export default webAuthnRouter;
