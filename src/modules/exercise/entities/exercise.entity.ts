import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExerciseStatus } from '../enums/exercise.enum';

export type ExerciseDocument = Exercise & Document;

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ required: true })
  title: string;

  @Prop()
  sub: string;

  @Prop({ type: String, enum: ExerciseStatus, required: true })
  status: ExerciseStatus;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);