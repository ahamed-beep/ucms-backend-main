import { Expose, Transform } from 'class-transformer';

export class ApplicationResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  @Transform(({ obj }) => {
    const u = obj?.userId;
    if (!u) return null;
    if (typeof u === 'string') return { id: u };
    return {
      id: u._id?.toString() ?? u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      emailId: u.emailId ?? u.email,
    };
  })
  userId: { id: string; firstName: string; lastName: string; emailId: string } | null;

  @Expose() university: string;
  @Expose() program: string;
  @Expose() country: string;
  @Expose() status: string;

  @Expose()
  @Transform(({ obj }) => obj?.timeline ?? [])
  timeline: { label: string; date?: string; done: boolean }[];

  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}