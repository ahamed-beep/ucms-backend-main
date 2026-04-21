import { Expose } from 'class-transformer';
export class ResponseVideoTestimonialDto {
  @Expose()
  id: string;
 
  @Expose()
  name: string;
 
  @Expose()
  university: string;
 
  @Expose()
  videoUrl: string;
 
  @Expose()
  createdAt: Date;
 
  @Expose()
  updatedAt: Date;
}