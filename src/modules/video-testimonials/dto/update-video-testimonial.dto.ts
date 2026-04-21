import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateVideoTestimonialDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
 
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  university?: string;
}