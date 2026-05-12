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
  @Transform(({ obj }) => obj?.userId?.toString() ?? null)
  userId: string | null;

  @Expose()
  @Transform(({ obj }) => obj?.courses ?? [])
  courses: { id: string; title: string }[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}