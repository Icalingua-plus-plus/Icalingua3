import { FromSchema } from 'json-schema-to-ts';

const schema = {
  type: 'object',
  required: ['qid', 'protocol', 'password'],
  properties: {
    qid: { type: 'integer', title: 'QQ号', default: 0 },
    password: { type: 'string', title: '密码', default: '' },
    protocol: {
      type: 'string',
      title: '协议',
      enum: ['iPad', 'Android Pad', 'Watch', 'Android Phone', 'Mac OS'],
      default: 'iPad',
    },
    toast: { type: 'boolean', title: '是否开启消息通知', default: true },
    onlyWebAuthn: { type: 'boolean', title: '是否仅使用 WebAuthn 进行登录验证', default: false },
    webAuthnOrigin: {
      type: 'array',
      title: 'WebAuthn 可使用的 URL',
      default: [],
      items: { type: 'string', description: '例：http://localhost:5173' },
    },
  },
} as const;

export default schema;

export type IAppConfig = FromSchema<typeof schema>;
