import { Types } from 'mongoose';
import {
  EducationLevel,
  HeardFrom,
  RegistrationStatus,
  StudyDestination,
} from '../enums/registration.enum';
import {  EventStatus } from '../../event/enums/event.enum';

export interface IEventSummary {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  tag: string;
  status: EventStatus;
}

export interface IRegistration {
  id: string;
  eventId: Types.ObjectId | IEventSummary;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  attendees: number;
  education: EducationLevel;
  destination?: StudyDestination;
  heardFrom?: HeardFrom;
  questions?: string;
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegistrationListResponse {
  data: IRegistration[];
  total: number;
  page: number;
  limit: number;
}

export interface IRegistrationMailPayload {
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  attendees: number;
}