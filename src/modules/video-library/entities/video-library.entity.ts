import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VideoStatus } from '../enums/video-library.enum';

export type VideoLibraryDocument = VideoLibrary & Document;

@Schema({ timestamps: true, collection: 'video_library' })
export class VideoLibrary {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  src: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: true, trim: true })
  views: string;

  @Prop({ required: true, enum: VideoStatus, default: VideoStatus.ACTIVE })
  status: VideoStatus;
}

export const VideoLibrarySchema = SchemaFactory.createForClass(VideoLibrary);