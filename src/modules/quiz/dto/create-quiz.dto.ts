import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  Min,
  Max,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {  QuizDifficulty, QuizStatus } from '../enums/quiz.enum';
import { CreateQuizQuestionDto } from './create-quiz-question.dto';

export class CreateQuizDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title: string;
 
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
 
 @IsString()
@MinLength(1)
category: string;
 
  @IsEnum(QuizDifficulty)
  difficulty: QuizDifficulty;
 
  @IsOptional()
  @IsEnum(QuizStatus)
  status?: QuizStatus;
 
  @IsInt()
  @Min(1)
  @Max(180)
  timeLimitMinutes: number;
 
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  @ArrayMinSize(1)
  questions: CreateQuizQuestionDto[];
}