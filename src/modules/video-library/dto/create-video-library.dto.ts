import { IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { VideoStatus } from '../enums/video-library.enum';

export class CreateVideoLibraryDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  views: string;

  @IsOptional()
  @IsEnum(VideoStatus)
  status?: VideoStatus;
}