import { Message } from 'apps/presence/src/message/entity/message.entity';
import { UUID } from 'sequelize';
import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { HasMany } from 'sequelize-typescript/dist/associations/has/has-many';
import { Default } from 'sequelize-typescript/dist/model/column/column-options/default';
import { PrimaryKey } from 'sequelize-typescript/dist/model/column/primary-key/primary-key';

@Table({
  tableName: 'user_messenger',
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @Column
  userName: string;

  @Column
  password: string;

  @Column
  email: string;
  @HasMany(() => Message)
  message: Message[];
}
