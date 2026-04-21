import { Expose } from 'class-transformer';

export class DestinationResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  flag: string;

  @Expose()
  tagline: string;

  @Expose()
  partnerUniversities: string;

  @Expose()
  programs: string;

  @Expose()
  averageCost: string;

  @Expose()
  intakes: string;

  @Expose()
  highlights: string[];

  @Expose()
  universities: string[];

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}