import {  EventStatus, EventLocationType } from '../enums/event.enum';

export interface IEvent {
  _id?: unknown;
  id?: string;
  title: string;
  description: string;
  day: string;
  monthYear: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  locationType: EventLocationType;
  tag: string;
  status: EventStatus;
  totalSeats: number;
  registeredCount: number;
  highlights: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventListResponse {
  data: IEvent[];
  total: number;
  page: number;
  limit: number;
}

export interface IEventStatusUpdate {
  status: EventStatus;
}

export interface ICreateEventPayload {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  locationType: EventLocationType;
  tag: string;
  status?: EventStatus;
  totalSeats: number;
  highlights?: string[];
  isActive?: boolean;
}

export interface IUpdateEventPayload extends Partial<ICreateEventPayload> {}

export interface IDeleteResponse {
  message: string;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
}