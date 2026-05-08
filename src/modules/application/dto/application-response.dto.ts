import { Expose, Transform } from 'class-transformer';

export class ApplicationResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

@Expose()
@Transform(({ obj }) => {
  const u = obj?.userId;
  if (!u) return null;
  if (typeof u === 'string') return u;
  if (u._id) return u._id.toString();
  if (u.id) return u.id;
  return u.toString();
})
userId: string;

  @Expose()
  university: string;

  @Expose()
  program: string;

  @Expose()
  country: string;

  @Expose()
  status: string;

 @Expose()
@Transform(({ obj }) => obj?.timeline ?? [])
timeline: { label: string; date?: string; done: boolean }[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}