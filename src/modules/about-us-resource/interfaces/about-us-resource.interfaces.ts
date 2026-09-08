import { ResourceStatus, ResourceTag } from '../enums/about-us-resource.enums';

export interface ICreateAboutUsResource {
  title: string;
  subtitle?: string;
  fileUrl: string;
  filePublicId: string;
  tag: ResourceTag;
  status?: ResourceStatus;
}

export interface IUpdateAboutUsResource {
  title?: string;
  subtitle?: string;
  fileUrl?: string;
  filePublicId?: string;
  tag?: ResourceTag;
  status?: ResourceStatus;
}

export interface IAboutUsResourceQuery {
  status?: ResourceStatus;
  tag?: ResourceTag;
  page?: number;
  limit?: number;
}

export interface IPaginatedAboutUsResources {
  data: IAboutUsResourceItem[];
  total: number;
  page: number;
  limit: number;
}

export interface IAboutUsResourceItem {
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