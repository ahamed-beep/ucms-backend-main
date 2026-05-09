import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AttemptStatus } from '../enums/exercise.enum';

export type ExerciseAttemptDocument = ExerciseAttempt & Document;

@Schema({ timestamps: true })
export class ExerciseAttempt {

  @Prop({ type: Types.ObjectId, ref: 'Exercise', required: true, index: true })
  exerciseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  studentId: Types.ObjectId;

  @Prop()
  essayText: string;

  @Prop()
  selectedOption: string;

  @Prop()
  transcriptText: string;

  @Prop()
  isCorrect: boolean;

  @Prop({ type: String, enum: AttemptStatus, default: AttemptStatus.PENDING })
  status: AttemptStatus;

  @Prop()
  adminFeedback: string;
}

export const ExerciseAttemptSchema = SchemaFactory.createForClass(ExerciseAttempt);

ExerciseAttemptSchema.index({ exerciseId: 1, studentId: 1 });