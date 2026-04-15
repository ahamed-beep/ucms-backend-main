import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { GallerySection } from '../enums/gallery-section.enum';

export class UpdateGalleryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsEnum(GallerySection)
  section?: GallerySection;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}