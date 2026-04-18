import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsString()
  @IsNotEmpty()
  test: string;
}