import { Expose } from 'class-transformer';

export class FAQResponseDto {
  @Expose()
  question: string;

  @Expose()
  answer: string;
}