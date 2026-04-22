import { Expose } from 'class-transformer';

export class VideoLibraryResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  src: string;

  @Expose()
  views: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}