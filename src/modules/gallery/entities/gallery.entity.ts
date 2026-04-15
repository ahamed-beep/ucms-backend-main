import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GallerySection } from '../enums/gallery-section.enum';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true })
export class Gallery {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  subtitle: string;

  @Prop({
    required: true,
    enum: GallerySection,
    type: String,
  })
  section: GallerySection;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  imagePublicIds: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);