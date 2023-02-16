import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LogInDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 16)
  userName: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 16)
  password: string;
}
