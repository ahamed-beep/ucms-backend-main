import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ConsultationStatus, ConsultationType } from '../enums/consultation-status.enum';

export type ConsultationDocument = Consultation & Document;

@Schema({ timestamps: true })
export class Consultation {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true, default: '' })
  destination: string;

  @Prop({ trim: true, default: '' })
  qualification: string;

  @Prop({ required: true })
  selectedDate: string;

  @Prop({ required: true })
  selectedTime: string;

  @Prop({ required: true, enum: ConsultationType })
  consultationType: ConsultationType;

  @Prop({ trim: true, default: '' })
  additionalInfo: string;

  @Prop({ enum: ConsultationStatus, default: ConsultationStatus.UNREAD })
  status: ConsultationStatus;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);