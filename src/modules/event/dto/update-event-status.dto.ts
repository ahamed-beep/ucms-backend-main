import { IsEnum, IsNotEmpty } from 'class-validator';
import { EventStatus } from '../enums/event.enum';

export class UpdateEventStatusDto {
  @IsEnum(EventStatus)
  @IsNotEmpty()
  status: EventStatus;
}