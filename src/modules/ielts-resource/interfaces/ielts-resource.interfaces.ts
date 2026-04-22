import { ResourceStatus, ResourceTag } from '../enums/ielts-resource.enums';

export interface ICreateIeltsResource {
  title: string;
  fileUrl: string;
  filePublicId: string;
  tag: ResourceTag;
  status?: ResourceStatus;
}

export interface IUpdateIeltsResource {
  title?: string;
  fileUrl?: string;
  filePublicId?: string;
  tag?: ResourceTag;
  status?: ResourceStatus;
}

export interface IIeltsResourceQuery {
  status?: ResourceStatus;
  tag?: ResourceTag;
  page?: number;
  limit?: number;
}

export interface IPaginatedIeltsResources {
  data: IIeltsResourceItem[];
  total: number;
  page: number;
  limit: number;
}

export interface IIeltsResourceItem {
  id: string;
  title: string;
  fileUrl: string;
  filePublicId: string;
  tag: ResourceTag;
  downloads: number;
  status: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
}