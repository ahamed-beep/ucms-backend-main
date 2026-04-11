import { IsMongoId, IsNotEmpty, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerInfoDto } from './Customerinfo.dto';

export class CreatePaymentOrderDto {
  @IsMongoId({ message: 'Invalid service page ID' })
  @IsNotEmpty()
  servicePageId: string;

  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customer: CustomerInfoDto;

  @IsOptional()
  @IsString()
  currency?: string;
}