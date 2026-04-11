import { Types } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../constant/payment.enum';

export interface ICustomerInfo {
  email: string;
  phone: string;

  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  address?: string;
}

export interface IPayment {
  _id?: Types.ObjectId;
  servicePageId: Types.ObjectId;
  serviceTitle: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  customer: ICustomerInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreatePaymentOrderResponse {
  success: boolean;
  paypalOrderId: string;
  approvalUrl: string;
  paymentId: string;
}

export interface ICapturePaymentResponse {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  serviceTitle: string;
  customer: ICustomerInfo;
}

export interface IPaymentListResponse {
  success: boolean;
  data: IPayment | IPayment[];
}

export interface IPayPalAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IPayPalOrderLink {
  href: string;
  rel: string;
  method: string;
}

export interface IPayPalCreateOrderResponse {
  id: string;
  status: string;
  links: IPayPalOrderLink[];
}

export interface IPayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: { value: string; currency_code: string };
      }>;
    };
  }>;
}