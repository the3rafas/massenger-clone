import { User } from 'apps/auth/src/user/entities/user.entity';
import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Default } from 'sequelize-typescript/dist/model/column/column-options/default';
import { PrimaryKey } from 'sequelize-typescript/dist/model/column/primary-key/primary-key';

@Table({
  tableName: 'Message_messenger',
})
export class Message extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @ForeignKey(() => User)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  userID: string;

  @ForeignKey(() => User)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE', type: DataType.UUID })
  friendid: string;

  @Column
  content: string;
}
