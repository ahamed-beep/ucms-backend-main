import { Expose, Transform } from 'class-transformer';

export class UserDocumentResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  @Transform(({ obj }) => {
    const u = obj?.userId;
    if (!u || typeof u === 'string') return { id: u };
    return {
      id: u._id?.toString() ?? u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      emailId: u.emailId,
    };
  })
  userId: {
    id: string;
    firstName: string;
    lastName: string;
    emailId: string;
  };

    @Expose()
  @Transform(({ obj }) => obj?.courses ?? [])
  courses: { id: string; title: string }[];

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