import { Expose, Type } from 'class-transformer';
import { ContactDataDto } from './contact-data.dto';

export class GetContactResponseDto {
  @Expose() success: boolean;
  @Expose() message: string;
  @Expose() @Type(() => ContactDataDto) data: ContactDataDto;
}