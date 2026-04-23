import { ClassMode, ClassStatus, ClassType } from '../enums/upcoming-class.enums';

export interface IUpcomingClass {
  id: string;
  title: string;
  date: Date;
  totalSpots: number;
  spotsLeft: number;
  type: ClassType;
  mode: ClassMode;
  location: string;
  instructor: string;
  status: ClassStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpcomingClassPaginated {
  data: IUpcomingClass[];
  total: number;
  page: number;
  limit: number;
}

export interface ICreateUpcomingClass {
  title: string;
  date: Date;
  totalSpots: number;
  spotsLeft: number;
  type: ClassType;
  mode: ClassMode;
  location?: string;
  instructor?: string;
  status?: ClassStatus;
}

export interface IUpdateUpcomingClass {
  title?: string;
  date?: Date;
  totalSpots?: number;
  spotsLeft?: number;
  type?: ClassType;
  mode?: ClassMode;
  location?: string;
  instructor?: string;
  status?: ClassStatus;
}