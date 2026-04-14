import { Expose, Type } from 'class-transformer';
import { ContactDataDto } from './contact-data.dto';

export class UpdateContactResponseDto {
  @Expose() success: boolean;
  @Expose() message: string;
  @Expose() @Type(() => ContactDataDto) data: ContactDataDto;
}