import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { InquiryStatus } from '../enums/inquiry-status.enum';

export type InquiryDocument = Inquiry & Document;

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  destination: string;

  @Prop({ required: true, trim: true })
  qualification: string;

  @Prop({ required: true, trim: true })
  test: string;

  @Prop({ enum: InquiryStatus, default: InquiryStatus.PENDING })
  status: InquiryStatus;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);