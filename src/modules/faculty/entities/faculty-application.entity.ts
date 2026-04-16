import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApplicationStatus } from '../enums/faculty-application.enum';

export type FacultyApplicationDocument = FacultyApplication & Document;

@Schema({ timestamps: true })
export class FacultyApplication {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true, default: null })
  linkedin: string;

  @Prop({ required: true, trim: true })
  highestQualification: string;

  @Prop({ required: true, min: 0 })
  yearsOfExperience: number;

  @Prop({ required: true, trim: true })
  institutionAffiliation: string;

  @Prop({ required: true, trim: true })
  currentJobPosition: string;

  @Prop({ required: true, trim: true })
  previousExperience: string;

  @Prop({ required: true, trim: true })
  coverLetter: string;

  @Prop({ required: true })
  cvUrl: string;

  @Prop({ required: true })
  cvPublicId: string;

  @Prop({ enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;
  
}

export const FacultyApplicationEntity = SchemaFactory.createForClass(FacultyApplication);