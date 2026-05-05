import { Expose, Type } from 'class-transformer';

export class CourseProgressItemDto {
  @Expose()
  courseId: string;

  @Expose()
  title: string;

  @Expose()
  progress: number;

  @Expose()
  modulesCompleted: number;

  @Expose()
  totalModules: number;

  @Expose()
  quizAvg: number;

  @Expose()
  assignmentAvg: number;
}

export class RecentScoreItemDto {
  @Expose()
  type: string;

  @Expose()
  title: string;

  @Expose()
  date: string;

  @Expose()
  score: number;
}

export class StudentProgressResponseDto {
  @Expose()
  overallAverage: number;

  @Expose()
  courseCompletionPercent: number;

  @Expose()
  modulesCompleted: number;

  @Expose()
  @Type(() => CourseProgressItemDto)
  courses: CourseProgressItemDto[];

  @Expose()
  @Type(() => RecentScoreItemDto)
  recentScores: RecentScoreItemDto[];
}