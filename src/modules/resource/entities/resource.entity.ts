import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ResourceType } from '../enums/resource.enum';

export type ResourceDocument = Resource & Document;

@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true })
  name: string;

  @Prop()
  meta: string;

  @Prop()
  url: string;

  @Prop()
  publicId: string;

  @Prop({ type: String, enum: ResourceType, default: ResourceType.PDF })
  type: ResourceType;

  @Prop({ type: Types.ObjectId, ref: 'CourseModule', required: true })
  courseModuleId: Types.ObjectId;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);