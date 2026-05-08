import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassSessionDocument = ClassSession & Document;

export enum ClassSessionType {
  VIDEO = 'Video',
  IN_PERSON = 'In-Person',
}

@Schema({ timestamps: true })
export class ClassSession {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  scheduledAt: Date;

  @Prop({ required: true })
  durationMinutes: number;

  @Prop({ type: String, enum: ClassSessionType, default: ClassSessionType.VIDEO })
  type: ClassSessionType;

  @Prop()
  level: string;

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop()
  meetingLink: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ClassSessionSchema = SchemaFactory.createForClass(ClassSession);
ClassSessionSchema.index({ courseId: 1, scheduledAt: 1 });