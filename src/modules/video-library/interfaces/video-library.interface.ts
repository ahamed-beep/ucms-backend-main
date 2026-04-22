export interface IVideoLibrary {
  id: string;
  title: string;
  src: string;
  publicId: string;
  views: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginatedVideoLibrary {
  data: IVideoLibrary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}