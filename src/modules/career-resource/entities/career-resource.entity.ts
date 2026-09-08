import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ResourceStatus, ResourceTag } from '../enum/career-resource.enums';

export type CareerResourceDocument = CareerResource & Document;

@Schema({ timestamps: true })
export class CareerResource {
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

export const CareerResourceSchema = SchemaFactory.createForClass(CareerResource);