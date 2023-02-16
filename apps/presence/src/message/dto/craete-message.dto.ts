import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatMessageDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  friendId: string;
}
