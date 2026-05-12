// create-consultation-slot.dto.ts
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConsultationSlotDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsArray()
  @IsString({ each: true })
  times: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// update-consultation-slot.dto.ts
export class UpdateConsultationSlotDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  times?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// consultation-slot-response.dto.ts
import { Expose } from 'class-transformer';

export class ConsultationSlotResponseDto {
  @Expose()
  id: string;

  @Expose()
  date: string;

  @Expose()
  times: string[];

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;
}