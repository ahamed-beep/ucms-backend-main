import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  emailId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}