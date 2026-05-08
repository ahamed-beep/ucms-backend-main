import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicationStatus } from '../enums/application-status.enum';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  university: string;

  @Prop({ required: true })
  program: string;

  @Prop({ required: true })
  country: string;

  @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.IN_PROGRESS })
  status: ApplicationStatus;

  @Prop({
    type: [
      {
        label: { type: String, required: true },
        date: { type: String },
        done: { type: Boolean, default: false },
      },
    ],
    default: [],
  })
  timeline: { label: string; date?: string; done: boolean }[];
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
ApplicationSchema.index({ userId: 1 });