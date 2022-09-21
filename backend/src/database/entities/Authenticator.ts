import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

/** 使用 WebAuthn 时存储凭证 */
@Entity()
export default class Authenticator {
  @PrimaryKey()
  @Property()
  credentialID!: Buffer;

  @Property()
  credentialPublicKey!: Buffer;

  @Property()
  counter!: number;

  @Property()
  credentialDeviceType!: string;

  @Property()
  credentialBackedUp!: boolean;

  @Property({ nullable: true })
  transports!: string[] | null;

  @Property()
  createdAt = new Date();

  @Property()
  lastUsedAt = new Date();

  @Property({ index: true })
  aaguid!: string;

  @Property({ nullable: true, default: null })
  attestationObject: Buffer | null;

  constructor(param: {
    credentialID: Buffer;
    credentialPublicKey: Buffer;
    counter: number;
    credentialDeviceType: string;
    credentialBackedUp: boolean;
    aaguid: string;
    transports?: string[];
    attestationObject: Buffer | null;
  }) {
    this.credentialID = param.credentialID;
    this.credentialPublicKey = param.credentialPublicKey;
    this.counter = param.counter;
    this.credentialDeviceType = param.credentialDeviceType;
    this.credentialBackedUp = param.credentialBackedUp;
    this.aaguid = param.aaguid;
    this.transports = param.transports || null;
    this.attestationObject = param.attestationObject || null;
  }
}
