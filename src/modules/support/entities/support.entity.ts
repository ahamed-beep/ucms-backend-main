import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SupportDocument = Support & Document;

@Schema({ timestamps: true })
export class Support {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;
}

export const SupportSchema = SchemaFactory.createForClass(Support);