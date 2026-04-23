import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
 
} from 'class-validator';

import { ResourceStatus, ResourceTag } from '../enums/ielts-resource.enums';
export class UpdateIeltsResourceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;
 
  @IsEnum(ResourceTag)
  @IsOptional()
  tag?: ResourceTag;
 
  @IsEnum(ResourceStatus)
  @IsOptional()
  status?: ResourceStatus;
}