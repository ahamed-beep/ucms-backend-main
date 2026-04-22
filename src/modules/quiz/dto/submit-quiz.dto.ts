import {
  IsArray,
  IsOptional,
  Min,
  IsInt,
} from 'class-validator';

export class SubmitQuizDto {
  @IsArray()
  answers: (number | null)[];
 
  @IsOptional()
  @IsInt()
  @Min(0)
  timeTakenSeconds?: number;
}