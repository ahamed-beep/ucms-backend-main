import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { ResourceStatus, ResourceTag } from '../enums/about-us-resource.enums';

export class UpdateAboutUsResourceDto {
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