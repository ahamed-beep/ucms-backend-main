import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ResourceType } from '../enums/resource.enum';

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  meta?: string;

  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;
}