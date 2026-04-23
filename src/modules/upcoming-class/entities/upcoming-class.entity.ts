import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ClassMode, ClassStatus, ClassType } from '../enums/upcoming-class.enums';

export type UpcomingClassDocument = UpcomingClass & Document;

@Schema({ timestamps: true, versionKey: false })
export class UpcomingClass {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, min: 0 })
  totalSpots: number;

  @Prop({ required: true, min: 0 })
  spotsLeft: number;

  @Prop({ required: true, enum: ClassType })
  type: ClassType;

  @Prop({ required: true, enum: ClassMode, default: ClassMode.ONLINE })
  mode: ClassMode;

  @Prop({ trim: true })
  location: string;

  @Prop({ trim: true })
  instructor: string;

  @Prop({ required: true, enum: ClassStatus, default: ClassStatus.ACTIVE })
  status: ClassStatus;
}

export const UpcomingClassSchema = SchemaFactory.createForClass(UpcomingClass);