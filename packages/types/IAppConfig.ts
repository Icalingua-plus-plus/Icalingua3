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
  },
} as const;

export default schema;

export type IAppConfig = FromSchema<typeof schema>;
