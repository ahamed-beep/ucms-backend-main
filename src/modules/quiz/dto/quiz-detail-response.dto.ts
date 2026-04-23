
import { Type, Expose } from 'class-transformer';
import { QuizQuestionResponseDto } from './quiz-question-response.dto';

export class QuizDetailResponseDto {
  @Expose()
  id: string;
 
  @Expose()
  title: string;
 
  @Expose()
  description?: string;
 
  @Expose()
  category: string;
 
  @Expose()
  difficulty: string;
 
  @Expose()
  status: string;
 
  @Expose()
  timeLimitMinutes: number;
 
  @Expose()
  totalQuestions: number;
 
  @Expose()
  attempts: number;
 
  @Expose()
  @Type(() => QuizQuestionResponseDto)
  questions: QuizQuestionResponseDto[];
 
  @Expose()
  createdAt: Date;
 
  @Expose()
  updatedAt: Date;
}