import { Expose } from 'class-transformer';
export class ResponseTestimonialDto {
  @Expose()
  id: string;
 
  @Expose()
  initials: string;
 
  @Expose()
  name: string;
 
  @Expose()
  program: string;
 
  @Expose()
  flagUrl: string;
 
  @Expose()
  rating: number;
 
  @Expose()
  quote: string;
 
  @Expose()
  university: string;
 
  @Expose()
  badge: string;
 
  @Expose()
  createdAt: Date;
}