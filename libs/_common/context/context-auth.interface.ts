import { User } from '../../user/models/user.model';
import { LangEnum } from '../../user/user.enum';
import { Timezone } from '../graphql/graphql-response.type';
import { Request } from 'express';

export const IContextAuthServiceToken = 'IContextAuthService';

export interface IContextAuthService {
  getTimezone(timezoneAsString: string): Timezone;

  getUserFromReqHeaders(req: Request): Promise<User>;

  getLocale(req: Request): { lang: LangEnum; country: string };

  hasPermission(permission: string, user: User): boolean;
}
