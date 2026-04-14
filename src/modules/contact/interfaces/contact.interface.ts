import { ContactStatus } from "../enums/contact-status.enum";

export interface IContact {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  isRead: boolean;
  readAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}