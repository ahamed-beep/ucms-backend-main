import { IsEnum, IsNotEmpty } from 'class-validator';
import { RegistrationStatus } from '../enums/registration.enum';

export class UpdateRegistrationStatusDto {
  @IsEnum(RegistrationStatus)
  @IsNotEmpty()
  status: RegistrationStatus;
}