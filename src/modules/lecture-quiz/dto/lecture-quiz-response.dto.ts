import { Expose, Type } from 'class-transformer';

export class LectureQuizItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  quizId: string;

  @Expose()
  lectureId: string;

  @Expose()
  order: number;

  @Expose()
  isCompleted: boolean;

  @Expose()
  scorePercent: number | null;

  @Expose()
  createdAt: Date;
}

export class LectureQuizListResponseDto {
  @Expose()
  @Type(() => LectureQuizItemResponseDto)
  data: LectureQuizItemResponseDto[];
}