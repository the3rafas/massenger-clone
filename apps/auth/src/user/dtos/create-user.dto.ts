import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 16)
  userName: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
