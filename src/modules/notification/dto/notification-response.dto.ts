import { Expose, Transform } from 'class-transformer';

export class NotificationResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  @Transform(({ obj }) => {
    const u = obj?.userId;
    if (!u) return null;
    if (typeof u === 'string') return u;
    return u._id?.toString() ?? u.id ?? u.toString();
  })
  userId: string;

  @Expose()
  @Transform(({ obj }) => {
    const u = obj?.userId;
    if (!u || typeof u === 'string') return null;
    return `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || null;
  })
  studentName: string;

  @Expose()
  @Transform(({ obj }) => {
    const u = obj?.userId;
    if (!u || typeof u === 'string') return null;
    return u.emailId ?? u.email ?? null;
  })
  studentEmail: string;

  @Expose()
  @Transform(({ obj }) => obj?.courses ?? [])
  courses: { id: string; title: string }[];

  @Expose()
  message: string;

  @Expose()
  status: string;

  @Expose()
  isRead: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}