import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeadlineColor } from '../enums/deadline-color.enum';

export type AdmissionDeadlineDocument = AdmissionDeadline & Document;

@Schema({ timestamps: true })
export class AdmissionDeadline {
  @Prop({ required: true, trim: true })
  university: string;

  @Prop({ required: true, trim: true })
  program: string;

  @Prop({ required: true, trim: true })
  deadline: string;

  @Prop({ required: true, enum: DeadlineColor, default: DeadlineColor.RED })
  deadlineColor: DeadlineColor;

  @Prop({ required: true, trim: true })
  intake: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AdmissionDeadlineSchema = SchemaFactory.createForClass(AdmissionDeadline);