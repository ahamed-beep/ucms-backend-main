import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVideoTestimonialDto {
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsString()
  @IsNotEmpty()
  university: string;
}