import { Expose } from 'class-transformer';
import { UpcomingClassResponseDto } from './upcoming-class-response.dto';


export class PaginatedUpcomingClassResponseDto {
  @Expose() data: UpcomingClassResponseDto[];
  @Expose() total: number;
  @Expose() page: number;
  @Expose() limit: number;
}