import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassAttendanceDocument = ClassAttendance & Document;

@Schema({ timestamps: true })
export class ClassAttendance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ClassSession', required: true })
  classSessionId: Types.ObjectId;

  @Prop({ required: true })
  joinedAt: Date;
}

export const ClassAttendanceSchema = SchemaFactory.createForClass(ClassAttendance);
ClassAttendanceSchema.index({ studentId: 1, classSessionId: 1 }, { unique: true });