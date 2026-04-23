import { Expose, Type } from "class-transformer";
import { QuizListItemResponseDto } from "./quiz-listItem-response.dto";

export class PaginatedQuizzesResponseDto {
  @Expose()
  @Type(() => QuizListItemResponseDto)
  data: QuizListItemResponseDto[];
 
  @Expose()
  total: number;
 
  @Expose()
  page: number;
 
  @Expose()
  limit: number;
 
  @Expose()
  totalPages: number;
}