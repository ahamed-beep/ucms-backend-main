import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LectureProgressDocument = LectureProgress & Document;

@Schema({ timestamps: true })
export class LectureProgress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lecture', required: true })
  lectureId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ default: false })
  completed: boolean;
}

export const LectureProgressSchema = SchemaFactory.createForClass(LectureProgress);
LectureProgressSchema.index({ userId: 1, lectureId: 1 }, { unique: true });