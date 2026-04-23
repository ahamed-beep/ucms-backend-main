import { Expose, Type } from "class-transformer";
import { QuizQuestionAdminResponseDto } from "./quiz-question-admin-response.dto";

export class QuizAdminDetailResponseDto {
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
  @Type(() => QuizQuestionAdminResponseDto)
  questions: QuizQuestionAdminResponseDto[];
 
  @Expose()
  createdAt: Date;
 
  @Expose()
  updatedAt: Date;
}
