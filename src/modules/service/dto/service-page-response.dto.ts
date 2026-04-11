import { Expose, Transform, Type } from 'class-transformer';
import { FAQResponseDto } from './faq-response.dto';

export class ServicePageResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;  

  @Expose()
  iconUrl: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  highlightPoints: string[];

  @Expose()
  overview: string;

  @Expose()
  steps: string[];

  @Expose()
  requiredDocuments: string[];

  @Expose()
  @Type(() => FAQResponseDto)
  faqs: FAQResponseDto[];

  @Expose()
  price: number;

  @Expose()
  slug: string;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}