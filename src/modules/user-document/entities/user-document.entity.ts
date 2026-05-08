import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DocumentCategory } from '../enums/document-category.enum';
import { DocumentStatus } from '../enums/document-status.enum';

export type UserDocumentDoc = UserDocument & Document;

@Schema({ timestamps: true })
export class UserDocument {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

@Prop({ type: String, enum: DocumentCategory, default: DocumentCategory.OTHER })
category: DocumentCategory;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  filePublicId: string;

  @Prop({ required: true })
  fileSize: string;

  @Prop({ type: String, enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;
}

export const UserDocumentSchema = SchemaFactory.createForClass(UserDocument);
UserDocumentSchema.index({ userId: 1 });