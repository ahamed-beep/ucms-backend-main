import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateClassSessionDto } from './create-class-session.dto';

export class UpdateClassSessionDto extends PartialType(CreateClassSessionDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}