import { Expose, Transform } from 'class-transformer';
import { EventLocationType, EventStatus } from '../enums/event.enum';

export class EventResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  day: string;

  @Expose()
  monthYear: string;

  @Expose()
  date: Date;

  @Expose()
  startTime: string;

  @Expose()
  endTime: string;

  @Expose()
  location: string;

  @Expose()
  locationType: EventLocationType;

  @Expose()
  tag: string;

  @Expose()
  status: EventStatus;

  @Expose()
  totalSeats: number;

  @Expose()
  registeredCount: number;

  @Expose()
  highlights: string[];

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}