import { ResourceStatus, ResourceTag } from '../enum/career-resource.enums';

export interface ICreateCareerResource {
  title: string;
  subtitle?: string;
  fileUrl: string;
  filePublicId: string;
  tag: ResourceTag;
  status?: ResourceStatus;
}

export interface IUpdateCareerResource {
  title?: string;
  subtitle?: string;
  fileUrl?: string;
  filePublicId?: string;
  tag?: ResourceTag;
  status?: ResourceStatus;
}

export interface ICareerResourceQuery {
  status?: ResourceStatus;
  tag?: ResourceTag;
  page?: number;
  limit?: number;
}

export interface IPaginatedCareerResources {
  data: ICareerResourceItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ICareerResourceItem {
  id: string;
  title: string;
  subtitle?: string;
  fileUrl: string;
  filePublicId: string;
  tag: ResourceTag;
  downloads: number;
  status: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
}