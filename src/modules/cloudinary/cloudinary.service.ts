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

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}