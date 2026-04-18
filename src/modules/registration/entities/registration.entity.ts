import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RegistrationStatus } from '../enums/registration.enum';

export type RegistrationDocument = RegistrationEntity & Document;

@Schema({ timestamps: true })
export class RegistrationEntity {
  @Prop({ type: Types.ObjectId, ref: 'EventEntity', required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, min: 1, default: 1 })
  attendees: number;

  @Prop({ required: true, trim: true })
  education: string;

  @Prop({ trim: true })
  destination: string;

  @Prop({ trim: true })
  heardFrom: string;

  @Prop({ trim: true })
  questions: string;

  @Prop({ required: true, enum: RegistrationStatus, default: RegistrationStatus.NEW })
  status: RegistrationStatus;
}

export const RegistrationSchema = SchemaFactory.createForClass(RegistrationEntity);