import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'user_messenger',
})
export class User extends Model {
  @Column
  userName: string;

  @Column
  password: string;

  @Column
  email: string;
}
