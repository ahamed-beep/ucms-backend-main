export interface ITestimonial {
  id: string;
  initials: string;
  name: string;
  program: string;
  flagUrl: string;
  flagPublicId?: string;
  rating: number;
  quote: string;
  university: string;
  badge: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTestimonial {
  initials: string;
  name: string;
  program: string;
  rating: number;
  quote: string;
  university: string;
  badge: string;
}

export interface IUpdateTestimonial {
  initials?: string;
  name?: string;
  program?: string;
  rating?: number;
  quote?: string;
  university?: string;
  badge?: string;
}

export interface ITestimonialFlagUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}