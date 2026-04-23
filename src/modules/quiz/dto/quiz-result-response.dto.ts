import { Expose } from "class-transformer";

export class QuizResultResponseDto {
  @Expose()
  quizId: string;
 
  @Expose()
  totalQuestions: number;
 
  @Expose()
  correctCount: number;
 
  @Expose()
  incorrectCount: number;
 
  @Expose()
  scorePercent: number;
 
  @Expose()
  timeTakenSeconds?: number;
}