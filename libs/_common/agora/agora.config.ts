import * as uuid from 'uuid';

export const agoraUid1 = () => Math.floor(Math.random() * 1000000);

export const agoraUid2 = () => Math.floor(Math.random() * 1000000);

export function privilegeExpiredTsConfig(durationInSec: number) {
  return Math.floor(Date.now() / 1000) + durationInSec * 60;
}

export const agoraUniqueId = (): string => uuid.v4();
