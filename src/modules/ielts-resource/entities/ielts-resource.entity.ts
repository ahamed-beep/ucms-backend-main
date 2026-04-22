import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ResourceStatus, ResourceTag } from '../enums/ielts-resource.enums';



export type IeltsResourceDocument = IeltsResource & Document;

@Schema({ timestamps: true })
export class IeltsResource {
  @Prop({ required: true, trim: true })
  title: string;

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

export const IeltsResourceSchema = SchemaFactory.createForClass(IeltsResource);