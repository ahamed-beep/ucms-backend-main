import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LectureAssignmentDocument = LectureAssignment & Document;

@Schema({ timestamps: true })
export class LectureAssignment {
  @Prop({ type: Types.ObjectId, ref: 'Lecture', required: true })
  lectureId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  @Prop()
  dueDate: Date;

  @Prop({ default: 0 })
  order: number;
}

export const LectureAssignmentSchema = SchemaFactory.createForClass(LectureAssignment);