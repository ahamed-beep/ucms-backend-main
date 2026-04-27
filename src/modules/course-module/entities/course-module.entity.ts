import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseModuleDocument = CourseModule & Document;

@Schema({ timestamps: true })
export class CourseModule {
  @Prop({ required: true })
  title: string;

  @Prop()
  hours: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lecture' }] })
  lectures: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Resource' }] })
  resources: Types.ObjectId[];
}

export const CourseModuleSchema = SchemaFactory.createForClass(CourseModule);