import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoTestimonialDocument = VideoTestimonial & Document;

@Schema({ timestamps: true })
export class VideoTestimonial {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  university: string;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ required: true })
  videoPublicId: string;

  createdAt: Date;
  updatedAt: Date;
}

export const VideoTestimonialSchema = SchemaFactory.createForClass(VideoTestimonial);