import { Expose } from "class-transformer";


export class QuizQuestionAdminResponseDto {
  @Expose()
  question: string;
 
  @Expose()
  options: string[];
 
  @Expose()
  correctAnswerIndex: number;
}