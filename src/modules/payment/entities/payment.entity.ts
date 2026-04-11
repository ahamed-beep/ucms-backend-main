import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../constant/payment.enum';

export type PaymentDocument = Payment & Document;

@Schema({ _id: false })
export class CustomerInfo {
  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  firstName?: string;

  @Prop({ trim: true })
  lastName?: string;

  @Prop({ trim: true })
  country?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  postalCode?: string;

  @Prop({ trim: true })
  address?: string;
}

export const CustomerInfoSchema = SchemaFactory.createForClass(CustomerInfo);

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  _id: Types.ObjectId; 

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ServicePage',
    required: true,
    index: true,
  })
  servicePageId: Types.ObjectId;  

  @Prop({ required: true, trim: true })
  serviceTitle: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, default: 'USD', uppercase: true, trim: true })
  currency: string;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
    index: true,
  })
  status: PaymentStatus;

  @Prop({
    type: String,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.PAYPAL,
  })
  method: PaymentMethod;

  @Prop({ trim: true, index: true })
  paypalOrderId?: string;

  @Prop({ trim: true })
  paypalCaptureId?: string;

  @Prop({ type: CustomerInfoSchema, required: true })
  customer: CustomerInfo;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);