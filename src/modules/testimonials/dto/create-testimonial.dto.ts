import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  initials: string;
 
  @IsString()
  @IsNotEmpty()
  name: string;
 
  @IsString()
  @IsNotEmpty()
  program: string;
 
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
 
  @IsString()
  @IsNotEmpty()
  quote: string;
 
  @IsString()
  @IsNotEmpty()
  university: string;
 
  @IsString()
  @IsNotEmpty()
  badge: string;
}