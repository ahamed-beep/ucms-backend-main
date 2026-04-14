import { Expose } from 'class-transformer';

export class DeleteContactResponseDto {
  @Expose() success: boolean;
  @Expose() message: string;
}