
import { Expose } from 'class-transformer';
import { IeltsResourceResponseDto } from './Ielts-resource-response.dto';


export class PaginatedIeltsResourceResponseDto {
  @Expose()
  data: IeltsResourceResponseDto[];
 
  @Expose()
  total: number;
 
  @Expose()
  page: number;
 
  @Expose()
  limit: number;
}