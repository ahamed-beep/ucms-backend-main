
import {  Expose } from 'class-transformer';

export class QuizQuestionResponseDto {
  @Expose()
  question: string;
 
  @Expose()
  options: string[];
}