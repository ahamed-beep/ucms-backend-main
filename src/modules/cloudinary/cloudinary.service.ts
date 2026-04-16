import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';
import * as streamifier from 'streamifier';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {

  // Existing method for images
  async uploadFile(
    buffer: Buffer,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 })  
      .toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'webp',  
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        },
      );
      streamifier.createReadStream(webpBuffer).pipe(uploadStream);
    });
  }

  // NEW METHOD: For CV/files upload
  async uploadCV(
    buffer: Buffer,
    originalName: string,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    const extension = originalName.split('.').pop()?.toLowerCase();
    const fileName = `cv_${Date.now()}.${extension}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto', // Auto detect file type
          public_id: fileName,
          access_mode: 'public',
        },
        (error, result: UploadApiResponse) => {
          if (error) {
            console.error('Cloudinary CV upload error:', error);
            return reject(error);
          }
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        },
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string, resourceType: string = 'image'): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}