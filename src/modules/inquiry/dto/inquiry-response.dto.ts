import { Expose, Type } from 'class-transformer';

export class InquiryDataDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  destination: string;

  @Expose()
  qualification: string;

  @Expose()
  test: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class InquiryResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  @Type(() => InquiryDataDto)
  data: InquiryDataDto | InquiryDataDto[];
}