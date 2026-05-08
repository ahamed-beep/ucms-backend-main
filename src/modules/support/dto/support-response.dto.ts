import { Expose, Transform } from 'class-transformer';

export class SupportResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  subject: string;

  @Expose()
  message: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}