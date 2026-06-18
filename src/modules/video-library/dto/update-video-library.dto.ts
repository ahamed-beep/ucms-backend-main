import { IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { VideoStatus } from '../enums/video-library.enum';

export class UpdateVideoLibraryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  views?: string;

  @IsOptional()
  @IsEnum(VideoStatus)
  status?: VideoStatus;
}