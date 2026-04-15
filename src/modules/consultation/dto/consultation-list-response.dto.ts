import { IsEnum, IsNotEmpty } from 'class-validator';
import { ConsultationStatus } from '../enums/consultation-status.enum';

export class UpdateConsultationStatusDto {
  @IsNotEmpty()
  @IsEnum(ConsultationStatus)
  status: ConsultationStatus;
}