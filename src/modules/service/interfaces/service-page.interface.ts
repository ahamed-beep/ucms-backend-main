import { Types } from 'mongoose';
export interface IFAQ {
  question: string;
  answer: string;
}

export interface IServicePage {
  _id?: Types.ObjectId;  // ✅ string se ObjectId kar do
  iconUrl: string;
  title: string;
  description: string;
  highlightPoints: string[];
  overview: string;
  steps: string[];
  requiredDocuments: string[];
  faqs: IFAQ[];
  price: number;
  slug: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateServicePage {
  iconUrl?: string;
  title: string;
  description: string;
  highlightPoints: string[];
  overview: string;
  steps: string[];
  requiredDocuments: string[];
  faqs: IFAQ[];
  price: number;
  isActive?: boolean;
}

export interface IUpdateServicePage {
  iconUrl?: string;
  title?: string;
  description?: string;
  highlightPoints?: string[];
  overview?: string;
  steps?: string[];
  requiredDocuments?: string[];
  faqs?: IFAQ[];
  price?: number;
  isActive?: boolean;
}

export interface IServicePageResponse {
  success: boolean;
  data: IServicePage | IServicePage[];
}

export interface IDeleteResponse {
  message: string;
}

export interface ICloudinaryUpload {
  secureUrl: string;
  publicId: string;
}