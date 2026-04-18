import { Expose, Type } from 'class-transformer';
import { EventResponseDto } from './event-response.dto';

export class EventListResponseDto {
  @Expose()
  @Type(() => EventResponseDto)
  data: EventResponseDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}