import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AssignmentStatus } from '../enums/assignment.enum';

export type LectureAssignmentSubmissionDocument = LectureAssignmentSubmission & Document;

@Schema({ timestamps: true })
export class LectureAssignmentSubmission {
  @Prop({ type: Types.ObjectId, ref: 'LectureAssignment', required: true })
  lectureAssignmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  filePublicId: string;

  @Prop({ default: AssignmentStatus.SUBMITTED })
  status: AssignmentStatus;

  @Prop({ default: null })
  grade: number;

  @Prop({ default: null })
  feedback: string;
}

export const LectureAssignmentSubmissionSchema = SchemaFactory.createForClass(LectureAssignmentSubmission);

LectureAssignmentSubmissionSchema.index({ lectureAssignmentId: 1, userId: 1 }, { unique: true });