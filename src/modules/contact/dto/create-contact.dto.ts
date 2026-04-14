import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateContactDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  fullName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  phone: string;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString()
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  subject: string;

  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MinLength(1, { message: 'Message must be at least 1 character' })
  @MaxLength(2000)
  message: string;
}