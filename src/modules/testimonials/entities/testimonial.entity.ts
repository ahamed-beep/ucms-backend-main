import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true })
  initials: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  program: string;

  @Prop()
  flagUrl: string;

  @Prop()
  flagPublicId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  quote: string;

  @Prop({ required: true })
  university: string;

  @Prop({ required: true })
  badge: string;

  createdAt: Date;
  updatedAt: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);