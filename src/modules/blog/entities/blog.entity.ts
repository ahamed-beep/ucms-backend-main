import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BlogCategory, BlogStatus } from '../enums/blog.enum';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true, versionKey: false })
export class Blog {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  excerpt: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, enum: BlogCategory })
  category: BlogCategory;

  @Prop({ required: true, trim: true })
  readTime: string;

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  imagePublicId: string;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ enum: BlogStatus, default: BlogStatus.DRAFT })
  status: BlogStatus;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);