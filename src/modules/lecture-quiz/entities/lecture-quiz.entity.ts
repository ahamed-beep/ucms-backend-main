import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LectureQuizDocument = LectureQuiz & Document;

@Schema({ timestamps: true })
export class LectureQuiz {
  @Prop({ type: Types.ObjectId, ref: 'Lecture', required: true })
  lectureId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quizId: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;
}

export const LectureQuizSchema = SchemaFactory.createForClass(LectureQuiz);