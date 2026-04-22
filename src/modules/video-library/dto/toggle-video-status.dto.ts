import { IsEnum } from 'class-validator';
import { VideoStatus } from '../enums/video-library.enum';

export class ToggleVideoStatusDto {
  @IsEnum(VideoStatus)
  status: VideoStatus;
}