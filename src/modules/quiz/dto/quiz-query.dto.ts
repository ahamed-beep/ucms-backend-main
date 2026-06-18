import { IsEnum, IsOptional, Min, Max, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { QuizDifficulty, QuizStatus, QuizType } from '../enums/quiz.enum';

export class QuizQueryDto {
  @IsOptional()
  @IsEnum(QuizStatus)
  status?: QuizStatus;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(QuizDifficulty)
  difficulty?: QuizDifficulty;

  @IsOptional()
  @IsEnum(QuizType)
  quizType?: QuizType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}