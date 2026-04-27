import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LectureType } from '../enums/lecture.enum';

export type LectureDocument = Lecture & Document;

@Schema({ timestamps: true })
export class Lecture {
  @Prop({ required: true })
  title: string;

  @Prop()
  duration: string;

  @Prop({ type: String, enum: LectureType, default: LectureType.VIDEO })
  type: LectureType;

  @Prop()
  videoUrl: string;

  @Prop()
  videoPublicId: string;

  @Prop()
  docUrl: string;

  @Prop()
  docPublicId: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'CourseModule', required: true })
  courseModuleId: Types.ObjectId;
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);