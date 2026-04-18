import { Expose, Transform } from 'class-transformer';
import {
  EducationLevel,
  HeardFrom,
  RegistrationStatus,
  StudyDestination,
} from '../enums/registration.enum';

class EventSummaryDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose() title: string;
  @Expose() date: Date;
  @Expose() day: string;
  @Expose() monthYear: string;
  @Expose() startTime: string;
  @Expose() endTime: string;
  @Expose() location: string;
  @Expose() tag: string;
  @Expose() status: string;
}
export class RegistrationResponseDto {
  @Expose()
  @Transform(({ obj }) => obj?.id ?? obj?._id?.toString())
  id: string;

  @Expose()
@Transform(({ obj }) => {
  const eventId = obj?.eventId;
  if (!eventId) return null;
  if (typeof eventId === 'object' && (eventId.id || eventId._id)) {
    return {
      id: eventId.id ?? eventId._id?.toString(),
      title: eventId.title,
      date: eventId.date,
      day: eventId.day,
      monthYear: eventId.monthYear,
      startTime: eventId.startTime,
      endTime: eventId.endTime,
      location: eventId.location,
      tag: eventId.tag,
      status: eventId.status,
    };
  }
  return eventId?.toString();
})
eventId: string | EventSummaryDto;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  country: string;

  @Expose()
  city: string;

  @Expose()
  attendees: number;

  @Expose()
  education: EducationLevel;

  @Expose()
  destination: StudyDestination;

  @Expose()
  heardFrom: HeardFrom;

  @Expose()
  questions: string;

  @Expose()
  status: RegistrationStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}