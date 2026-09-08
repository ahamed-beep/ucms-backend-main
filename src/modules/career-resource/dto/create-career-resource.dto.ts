import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { ResourceStatus, ResourceTag } from '../enum/career-resource.enums';

export class CreateCareerResourceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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