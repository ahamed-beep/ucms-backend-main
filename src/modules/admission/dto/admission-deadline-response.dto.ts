import { Expose, Type } from 'class-transformer';

export class AdmissionDeadlineDataDto {
  @Expose()
  id: string;

  @Expose()
  university: string;

  @Expose()
  program: string;

  @Expose()
  deadline: string;

  @Expose()
  deadlineColor: string;

  @Expose()
  intake: string;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class AdmissionDeadlineResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  @Type(() => AdmissionDeadlineDataDto)
  data: AdmissionDeadlineDataDto | AdmissionDeadlineDataDto[];
}