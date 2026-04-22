import {
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  IsInt,
  MinLength,
} from 'class-validator';

export class CreateQuizQuestionDto {
  @IsString()
  @MinLength(1)
  question: string;
 
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  options: string[];
 
  @IsInt()
  @Min(0)
  correctAnswerIndex: number;
}
 