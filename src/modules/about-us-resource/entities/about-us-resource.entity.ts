import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ResourceStatus, ResourceTag } from '../enums/about-us-resource.enums';

export type AboutUsResourceDocument = AboutUsResource & Document;

@Schema({ timestamps: true })
export class AboutUsResource {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  subtitle?: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  filePublicId: string;

  @Prop({ required: true, enum: ResourceTag, default: ResourceTag.PDF })
  tag: ResourceTag;

  @Prop({ default: 0 })
  downloads: number;

  @Prop({ required: true, enum: ResourceStatus, default: ResourceStatus.ACTIVE })
  status: ResourceStatus;
}

export const AboutUsResourceSchema = SchemaFactory.createForClass(AboutUsResource);