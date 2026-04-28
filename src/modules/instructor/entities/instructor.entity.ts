import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InstructorDocument = Instructor & Document;

@Schema({ timestamps: true })
export class Instructor {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  designation: string;

  @Prop()
  bio: string;

  @Prop()
  experience: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  avatarPublicId: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
InstructorSchema.index({ courseId: 1 }, { unique: true });