import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CourseStatus } from '../enums/course.enum';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  teacher: string;

  @Prop()
  hours: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  progress: number;

  @Prop()
  lectures: string;

  @Prop()
  scheduledTime: string;

  @Prop({
    type: String,
    enum: CourseStatus,
    default: CourseStatus.NOT_STARTED,
  })
  status: CourseStatus;

  @Prop()
  thumbnailUrl: string;

  @Prop()
  thumbnailPublicId: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'CourseModule' }] })
  courseModules: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Material' }] })
  materials: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Exercise' }] })
  exercises: Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);