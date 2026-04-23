import { Expose } from "class-transformer";

export class QuizListItemResponseDto {
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
  createdAt: Date;
 
  @Expose()
  updatedAt: Date;
}