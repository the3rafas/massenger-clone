import { BuildOptions } from 'sequelize/types';
import { Model } from 'sequelize-typescript';

// We need to declare an interface for our model that is basically what our class would be
export interface MyModel extends Model {}

// Need to declare the static model so `findOne` etc. use correct types.
export type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MyModel;
};
