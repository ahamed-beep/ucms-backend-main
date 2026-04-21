import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BlogCategory, BlogStatus } from '../enums/blog.enum';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  description: string;

  @IsEnum(BlogCategory)
  @IsNotEmpty()
  category: BlogCategory;

  @IsString()
  @IsNotEmpty()
  readTime: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}