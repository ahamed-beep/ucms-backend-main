import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExerciseType } from '../enums/exercise.enum';

export type ExerciseDocument = Exercise & Document;

@Schema({ _id: false })
export class McqOption {
  @Prop({ required: true }) text: string;    
}
export const McqOptionSchema = SchemaFactory.createForClass(McqOption);

@Schema({ timestamps: true })
export class Exercise {

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true, index: true })
  courseId: Types.ObjectId;

  @Prop({ type: String, enum: ExerciseType, required: true })
  type: ExerciseType;

  @Prop({ required: true })
  title: string;

  @Prop()
  instructions: string;

  

  @Prop()
  passage: string;                          

  @Prop({ type: [McqOptionSchema], default: [] })
  options: McqOption[];                  

  @Prop()
  correctOption: string;                   

  @Prop()
  audioUrl: string;

  @Prop()
  audioPublicId: string;


}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);