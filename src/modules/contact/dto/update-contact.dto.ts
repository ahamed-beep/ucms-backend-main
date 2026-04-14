import { IsEnum, IsOptional } from 'class-validator';
import { ContactStatus } from '../enums/contact-status.enum';

export class UpdateContactDto {
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}