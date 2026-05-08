import { Expose, Transform } from 'class-transformer';

export class StudyMaterialResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ obj }) => {
    const c = obj?.courseId;
    if (!c) return null;
    if (typeof c === 'string') return c;
    if (c.id) return c.id;
    if (c._id) return c._id.toString();
    return null;
  })
  courseId: string;

  @Expose()
  @Transform(({ obj }) => {
    const c = obj?.classSessionId;
    if (!c) return null;
    if (typeof c === 'string') return c;
    if (c.id) return c.id;
    if (c._id) return c._id.toString();
    return null;
  })
  classSessionId: string | null;

  @Expose()
  type: string;

  @Expose()
  fileUrl: string;

  @Expose()
  fileSize: string;

  @Expose()
  createdAt: Date;
}