import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConsultationSlotDocument = ConsultationSlot & Document;

@Schema({ timestamps: true })
export class ConsultationSlot {
  @Prop({ required: true, trim: true })
  date: string; 

  @Prop({ type: [String], default: [] })
  times: string[]; 

  @Prop({ default: true })
  isActive: boolean;
}

export const ConsultationSlotSchema = SchemaFactory.createForClass(ConsultationSlot);