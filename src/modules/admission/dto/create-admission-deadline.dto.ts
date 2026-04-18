import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { DeadlineColor } from '../enums/deadline-color.enum';

export class CreateAdmissionDeadlineDto {
  @IsString()
  @IsNotEmpty()
  university: string;

  @IsString()
  @IsNotEmpty()
  program: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsEnum(DeadlineColor)
  @IsNotEmpty()
  deadlineColor: DeadlineColor;

  @IsString()
  @IsNotEmpty()
  intake: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}