import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { ResourceStatus, ResourceTag } from '../enum/career-resource.enums';

export class UpdateCareerResourceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsEnum(ResourceTag)
  @IsOptional()
  tag?: ResourceTag;

  @IsEnum(ResourceStatus)
  @IsOptional()
  status?: ResourceStatus;
}