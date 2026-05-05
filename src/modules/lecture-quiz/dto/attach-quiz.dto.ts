import { IsMongoId, IsOptional, IsNumber, Min } from 'class-validator';

export class AttachQuizDto {
  @IsMongoId()
  quizId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}