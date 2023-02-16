import { User } from 'apps/auth/src/user/entities/user.entity';
import { Message } from 'apps/presence/src/message/entity/message.entity';
import { plural } from 'pluralize';

import { buildRepository } from './database-repository.builder';

export const models = [User,Message];

export const repositories = models.map((m) => ({
  provide: `${plural(m.name)}Repository`,
  useClass: buildRepository(m),
}));
