import {
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ResourceStatus, ResourceTag } from '../enum/career-resource.enums';

export class CareerResourceQueryDto {
  @IsEnum(ResourceStatus)
  @IsOptional()
  status?: ResourceStatus;

  @IsEnum(ResourceTag)
  @IsOptional()
  tag?: ResourceTag;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}