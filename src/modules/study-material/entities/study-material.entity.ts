import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudyMaterialDocument = StudyMaterial & Document;

export enum StudyMaterialType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  DOC = 'DOC',
}

@Schema({ timestamps: true })
export class StudyMaterial {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ClassSession', default: null })
  classSessionId: Types.ObjectId | null;

  @Prop({ type: String, enum: StudyMaterialType, default: StudyMaterialType.PDF })
  type: StudyMaterialType;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  filePublicId: string;

  @Prop()
  fileSize: string;
}

export const StudyMaterialSchema = SchemaFactory.createForClass(StudyMaterial);
StudyMaterialSchema.index({ courseId: 1 });
StudyMaterialSchema.index({ classSessionId: 1 });