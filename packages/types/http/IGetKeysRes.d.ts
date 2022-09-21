export interface IGetKeysRes {
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  aaguid: string;
  attestationObject: string | undefined;
  lastUsedAt: number;
  createdAt: number;
  credentialID: string;
}
