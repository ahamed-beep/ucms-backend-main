import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConsultationType } from '../enums/consultation-status.enum';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsNotEmpty()
  @IsString()
  selectedDate: string;

  @IsNotEmpty()
  @IsString()
  selectedTime: string;

  @IsNotEmpty()
  @IsEnum(ConsultationType)
  consultationType: ConsultationType;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}