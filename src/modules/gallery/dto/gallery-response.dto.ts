import { Expose, Type } from 'class-transformer';

export class GalleryItemDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  subtitle: string;

  @Expose()
  section: string;

  @Expose()
  images: string[];

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class GalleryResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  total?: number;

  @Expose()
  @Type(() => GalleryItemDto)
  data: GalleryItemDto | GalleryItemDto[];
}