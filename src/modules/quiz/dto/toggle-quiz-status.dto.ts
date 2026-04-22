import {
  IsEnum,
} from 'class-validator';
import {  QuizStatus } from '../enums/quiz.enum';

export class ToggleQuizStatusDto {
  @IsEnum(QuizStatus)
  status: QuizStatus;
}