import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ServicePageDocument = ServicePage & Document;



@Schema({ _id: false })
export class FAQ {
  @Prop({ required: true, trim: true })
  question: string;

  @Prop({ required: true, trim: true })
  answer: string;
}
export const FAQSchema = SchemaFactory.createForClass(FAQ);



@Schema({ timestamps: true, collection: 'service_pages' })
export class ServicePage {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  iconUrl: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: [String], default: [] })
  highlightPoints: string[];

  @Prop({ required: true, trim: true })
  overview: string;

  @Prop({ type: [String], default: [] })
  steps: string[];

  @Prop({ type: [String], default: [] })
  requiredDocuments: string[];

  @Prop({ type: [FAQSchema], default: [] })
  faqs: FAQ[];

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug: string;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ServicePageSchema = SchemaFactory.createForClass(ServicePage);