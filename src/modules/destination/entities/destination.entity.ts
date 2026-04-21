import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DestinationDocument = Destination & Document;

@Schema({ timestamps: true })
export class Destination {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  flag: string;

  @Prop({ required: true })
  tagline: string;

  @Prop({ required: true })
  partnerUniversities: string;

  @Prop({ required: true })
  programs: string;

  @Prop({ required: true })
  averageCost: string;

  @Prop({ required: true })
  intakes: string;

  @Prop({ type: [String], default: [] })
  highlights: string[];

  @Prop({ type: [String], default: [] })
  universities: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);