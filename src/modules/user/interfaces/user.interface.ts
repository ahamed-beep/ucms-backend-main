import { Schema as MongooseSchema } from 'mongoose';

export interface IUser {
  _id: MongooseSchema.Types.ObjectId;
  firstName: string;
  lastName: string;
  emailId: string;
  password?: string;
  role: 'student' | 'admin';
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}