import { Expose } from 'class-transformer';
import { ConsultationStatus, ConsultationType } from '../enums/consultation-status.enum';

export class ConsultationResponseDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  destination: string;

  @Expose()
  qualification: string;

  @Expose()
  selectedDate: string;

  @Expose()
  selectedTime: string;

  @Expose()
  consultationType: ConsultationType;

  @Expose()
  additionalInfo: string;

  @Expose()
  status: ConsultationStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}