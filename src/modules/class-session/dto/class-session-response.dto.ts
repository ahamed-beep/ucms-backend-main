import { Expose, Transform, Type } from 'class-transformer';

export class InstructorInfoDto {
  @Expose()
  @Transform(({ obj }) => obj?._id?.toString() ?? obj?.id)
  id: string;

  @Expose()
  name: string;

  @Expose()
  designation: string;

  @Expose()
  avatarUrl: string;
}

export class CourseInfoDto {
  @Expose()
  @Transform(({ obj }) => obj?._id?.toString() ?? obj?.id)
  id: string;

  @Expose()
  title: string;
}

export class ClassSessionResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => CourseInfoDto)
  @Transform(({ obj }) => {
    const c = obj?.courseId;
    if (!c || typeof c === 'string') return undefined;
    return c;
  })
  course: CourseInfoDto;

  @Expose()
  @Type(() => InstructorInfoDto)
  @Transform(({ obj }) => {
    const instructor = obj?.courseId?.instructorId;
    if (!instructor || typeof instructor === 'string') return undefined;
    return instructor;
  })
  instructor: InstructorInfoDto;

  @Expose()
  scheduledAt: Date;

  @Expose()
  durationMinutes: number;

  @Expose()
  type: string;

  @Expose()
  level: string;

  @Expose()
  topics: string[];

  @Expose()
  meetingLink: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ obj }) => obj?.attended ?? false)
  attended: boolean;

  @Expose()
  createdAt: Date;
}