import { sequelizeInstance } from './database.providers';

export function ApplyDbTransaction(): MethodDecorator {
  return function (_, __, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = async function () {
      let res: any;

      await sequelizeInstance.query('start transaction');
      res = await originalMethod.apply(this, arguments);
      process.env.NODE_ENV === 'testing'
        ? await sequelizeInstance.query('rollback')
        : await sequelizeInstance.query('commit');

      return res;
    };
  };
}
