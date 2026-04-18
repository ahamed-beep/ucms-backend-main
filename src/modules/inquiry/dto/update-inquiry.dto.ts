import { IsEnum, IsOptional } from 'class-validator';
import { InquiryStatus } from '../enums/inquiry-status.enum';

export class UpdateInquiryDto {
  @IsEnum(InquiryStatus)
  @IsOptional()
  status?: InquiryStatus;
}