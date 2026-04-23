import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {  QuizDifficulty, QuizStatus } from '../enums/quiz.enum';

export type QuizDocument = Quiz & Document;

@Schema({ _id: false })
export class QuizQuestion {
  @Prop({ required: true, trim: true })
  question: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true, min: 0 })
  correctAnswerIndex: number;
}

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);

@Schema({ timestamps: true, collection: 'quizzes' })
export class Quiz {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

@Prop({ required: true, trim: true })
category: string;

  @Prop({ required: true, enum: QuizDifficulty, default: QuizDifficulty.MEDIUM })
  difficulty: QuizDifficulty;

  @Prop({ required: true, enum: QuizStatus, default: QuizStatus.ACTIVE })
  status: QuizStatus;

  @Prop({ required: true, min: 1, default: 28 })
  timeLimitMinutes: number;

  @Prop({ type: [QuizQuestionSchema], required: true, default: [] })
  questions: QuizQuestion[];

  @Prop({ default: 0 })
  attempts: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

QuizSchema.virtual('totalQuestions').get(function (this: QuizDocument) {
  return this.questions.length;
});

QuizSchema.set('toObject', { virtuals: true });
QuizSchema.set('toJSON', { virtuals: true });