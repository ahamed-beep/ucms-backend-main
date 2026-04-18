import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {  EventStatus, EventLocationType } from '../enums/event.enum';

export type EventDocument = EventEntity & Document;

@Schema({ timestamps: true })
export class EventEntity {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true })
  day: string;

  @Prop({ required: true })
  monthYear: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: true, enum: EventLocationType, default: EventLocationType.PHYSICAL })
  locationType: EventLocationType;
  
@Prop({ required: true, trim: true })
tag: string;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.REGISTRATIONS_OPEN })
  status: EventStatus;

  @Prop({ required: true, min: 1 })
  totalSeats: number;

  @Prop({ default: 0 })
  registeredCount: number;

  @Prop({ type: [String], default: [] })
  highlights: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(EventEntity);