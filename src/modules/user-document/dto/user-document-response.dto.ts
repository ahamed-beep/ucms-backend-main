import { Expose, Transform } from 'class-transformer';

export class UserDocumentResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  @Transform(({ obj }) => obj?.userId?.toString())
  userId: string;

  @Expose()
  name: string;

  @Expose()
  category: string;

  @Expose()
  fileUrl: string;

  @Expose()
  fileSize: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}