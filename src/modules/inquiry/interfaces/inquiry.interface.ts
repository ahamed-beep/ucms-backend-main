import { InquiryDocument } from '../entities/inquiry.entity';

export interface IInquiryResponse {
  success: boolean;
  data: InquiryDocument | InquiryDocument[];
}

export interface IDeleteResponse {
  success: boolean;
  message: string;
}