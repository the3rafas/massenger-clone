import { Global, Module } from '@nestjs/common';
import { repositories } from './database.models';
import { databaseProvider } from './database.providers';

@Global()
@Module({
  providers: [databaseProvider, ...repositories],
  exports: [databaseProvider, ...repositories]
})
export class DatabaseModule {}
