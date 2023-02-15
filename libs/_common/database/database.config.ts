import { SequelizeOptions } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { models } from './database.models';

export const config = (configService: ConfigService) => {
  return <SequelizeOptions>{
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database:
      configService.get('NODE_ENV') === 'test'
        ? configService.get('TEST_DB_NAME')
        : configService.get('POSTGRES_DB'),
    host: configService.get('DB_HOST_NAME'),
    port: 5432,
    dialect: 'postgres',
    logging: (sql) => {
      // return configService.get('NODE_ENV') === 'test'
      //   ? false
      //   : console.log(`✔✔✔✔ ${new Date()}: ${sql}\n\n`);

      return false;
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // This approach to load models is incredibly faster than files matching
    models,
  };
};
