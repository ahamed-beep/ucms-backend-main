import { IsString, IsNotEmpty } from 'class-validator';

export class FAQDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}