import { DataType as DataTypeObj } from 'sequelize-typescript';
import { DataType } from 'sequelize/types';

export function getColumnEnum(enumValue: object): DataType {
  return DataTypeObj.ENUM(...Object.values(enumValue));
}
