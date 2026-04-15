import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GallerySection } from '../enums/gallery-section.enum';

export class CreateGalleryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsEnum(GallerySection)
  section: GallerySection;
}