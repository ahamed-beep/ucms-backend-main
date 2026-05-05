import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LectureQuizCompletionDocument = LectureQuizCompletion & Document;

@Schema({ timestamps: true })
export class LectureQuizCompletion {
  @Prop({ type: Types.ObjectId, ref: 'LectureQuiz', required: true })
  lectureQuizId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  scorePercent: number;

  @Prop({ required: true })
  timeTakenSeconds: number;
}

export const LectureQuizCompletionSchema = SchemaFactory.createForClass(LectureQuizCompletion);

LectureQuizCompletionSchema.index({ lectureQuizId: 1, userId: 1 }, { unique: true });