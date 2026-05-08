import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SupportStatus } from '../enums/support-status.enum';

export type SupportDocument = Support & Document;

@Schema({ timestamps: true })
export class Support {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ type: String, enum: SupportStatus, default: SupportStatus.PENDING })
  status: SupportStatus;
}

export const SupportSchema = SchemaFactory.createForClass(Support);