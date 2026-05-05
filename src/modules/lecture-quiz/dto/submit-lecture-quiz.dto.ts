import { IsArray, IsInt, IsOptional, Min } from 'class-validator';

export class SubmitLectureQuizDto {
  @IsArray()
  answers: (number | null)[];

  @IsOptional()
  @IsInt()
  @Min(0)
  timeTakenSeconds?: number;
}