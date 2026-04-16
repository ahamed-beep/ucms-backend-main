import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import { Response } from 'express';

import { CreateFacultyApplicationDto } from './dto/create-faculty-application.dto';
import { UpdateFacultyStatusDto } from './dto/update-faculty-status.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FacultyApplication, FacultyApplicationDocument } from './entities/faculty-application.entity';
import { ApplicationStatus } from './enums/faculty-application.enum';
import { adminNotificationTemplate } from './templates/admin-notification.template';
import { rejectedTemplate } from './templates/rejected.template';
import { acceptedTemplate } from './templates/accepted.template';
import { underReviewTemplate } from './templates/under-review.template';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@Injectable()
export class FacultyApplicationService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(FacultyApplication.name)
    private readonly facultyApplicationModel: Model<FacultyApplicationDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async findById(id: string): Promise<FacultyApplicationDocument> {
    const application = await this.facultyApplicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Faculty application not found.');
    }
    return application;
  }

async downloadCv(id: string, res: Response): Promise<void> {
  const application = await this.findById(id);

  if (!application.cvUrl) {
    throw new NotFoundException('CV file not found.');
  }

  // Since files are uploaded as public, just redirect to the direct URL
  const cvUrl = application.cvUrl;

  // Determine filename
  const extension = cvUrl.split('.').pop()?.toLowerCase() ?? 'pdf';
  const filename = `CV_${application.fullName.replace(/\s+/g, '_')}.${extension}`;

  // Fetch the file and pipe it with proper headers
  https.get(cvUrl, (fileStream) => {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fileStream.pipe(res);
  }).on('error', (err) => {
    console.error('CV download error:', err);
    throw new InternalServerErrorException('Failed to download CV.');
  });
}
async create(
  dto: CreateFacultyApplicationDto,
  file: Express.Multer.File,
): Promise<any> {
  if (!file) {
    throw new BadRequestException('CV/Resume file is required.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestException(
      'Invalid file type. Only PDF, DOC, and DOCX are allowed.',
    );
  }

  let cvUrl: string;
  let cvPublicId: string;

  try {
    const uploaded = await this.uploadCv(file);
    cvUrl = uploaded.secureUrl;
    cvPublicId = uploaded.publicId;
  } catch (error) {
    console.error('Upload error:', error);
    throw new InternalServerErrorException('Failed to upload CV. Please try again.');
  }

  const application = await this.facultyApplicationModel.create({
    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phone,
    linkedin: dto.linkedin || null,
    highestQualification: dto.highestQualification,
    yearsOfExperience: dto.yearsOfExperience,
    institutionAffiliation: dto.institutionAffiliation,
    currentJobPosition: dto.currentJobPosition,
    previousExperience: dto.previousExperience,
    coverLetter: dto.coverLetter,
    cvUrl: cvUrl,
    cvPublicId: cvPublicId,
    status: ApplicationStatus.PENDING,
  });

  await this.sendSubmissionEmails(application);

  // Return without createdAt/updatedAt
  return {
    id: application._id.toString(),
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    linkedin: application.linkedin || null,
    highestQualification: application.highestQualification,
    yearsOfExperience: application.yearsOfExperience,
    institutionAffiliation: application.institutionAffiliation,
    currentJobPosition: application.currentJobPosition,
    previousExperience: application.previousExperience,
    coverLetter: application.coverLetter,
    cvUrl: application.cvUrl,
    status: application.status,
  };
}

async findAll(): Promise<any[]> {
  const applications = await this.facultyApplicationModel.find().sort({ createdAt: -1 });

  return applications.map(app => ({
    id: app._id.toString(),
    fullName: app.fullName,
    email: app.email,
    phone: app.phone,
    linkedin: app.linkedin || null,
    highestQualification: app.highestQualification,
    yearsOfExperience: app.yearsOfExperience,
    institutionAffiliation: app.institutionAffiliation,
    currentJobPosition: app.currentJobPosition,
    previousExperience: app.previousExperience,
    coverLetter: app.coverLetter,
    cvUrl: app.cvUrl,
    status: app.status,
    createdAt: (app as any).createdAt, // ← add this
  }));
}

 async updateStatus(
  id: string,
  dto: UpdateFacultyStatusDto,
): Promise<any> {
  const application = await this.facultyApplicationModel.findByIdAndUpdate(
    id,
    { status: dto.status },
    { new: true },
  );

  if (!application) {
    throw new NotFoundException('Faculty application not found.');
  }

  await this.sendStatusEmail(application);

  return {
    id: application._id.toString(),
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    linkedin: application.linkedin || null,
    highestQualification: application.highestQualification,
    yearsOfExperience: application.yearsOfExperience,
    institutionAffiliation: application.institutionAffiliation,
    currentJobPosition: application.currentJobPosition,
    previousExperience: application.previousExperience,
    coverLetter: application.coverLetter,
    cvUrl: application.cvUrl,
    status: application.status,
  };
}

  async remove(id: string): Promise<void> {
    const application = await this.facultyApplicationModel.findById(id);

    if (!application) {
      throw new NotFoundException('Faculty application not found.');
    }

    if (application.cvPublicId) {
      try {
        const { v2: cloudinary } = require('cloudinary');
        await cloudinary.uploader.destroy(application.cvPublicId, { resource_type: 'auto' });
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error);
      }
    }

    await this.facultyApplicationModel.findByIdAndDelete(id);
  }

  private async uploadCv(
    file: Express.Multer.File,
  ): Promise<{ secureUrl: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const { v2: cloudinary } = require('cloudinary');
      const streamifier = require('streamifier');
      
      cloudinary.config({
        cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
        api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      });

      const originalName = file.originalname;
      const extension = originalName.split('.').pop()?.toLowerCase();
      const fileName = `cv_${Date.now()}.${extension}`;

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'faculty-cvs',
          resource_type: 'auto',
          public_id: fileName,
          access_mode: 'public',
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve({ secureUrl: result.secure_url, publicId: result.public_id });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }

  private async sendSubmissionEmails(application: FacultyApplicationDocument): Promise<void> {
    const adminEmail = this.configService.get<string>('SMTP_USER');
    const fromEmail = this.buildFromEmail();

    await Promise.allSettled([
      this.transporter.sendMail({
        from: fromEmail,
        to: application.email,
        subject: 'Your Faculty Application Has Been Received – UCMS',
        html: underReviewTemplate(application.fullName),
      }),
      this.transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        subject: `New Faculty Application: ${application.fullName}`,
        html: adminNotificationTemplate({
          fullName: application.fullName,
          email: application.email,
          phone: application.phone,
          linkedin: application.linkedin,
          highestQualification: application.highestQualification,
          yearsOfExperience: application.yearsOfExperience,
          institutionAffiliation: application.institutionAffiliation,
          currentJobPosition: application.currentJobPosition,
          previousExperience: application.previousExperience,
          coverLetter: application.coverLetter,
          cvUrl: application.cvUrl,
        }),
      }),
    ]);
  }

  private async sendStatusEmail(application: FacultyApplicationDocument): Promise<void> {
    const fromEmail = this.buildFromEmail();

    const statusEmailMap: Partial<Record<ApplicationStatus, { subject: string; html: string }>> = {
      [ApplicationStatus.REVIEWED]: {
        subject: 'Your Faculty Application is Under Review – UCMS',
        html: underReviewTemplate(application.fullName),
      },
      [ApplicationStatus.ACCEPTED]: {
        subject: 'Congratulations! Your Faculty Application Has Been Accepted – UCMS',
        html: acceptedTemplate(application.fullName),
      },
      [ApplicationStatus.REJECTED]: {
        subject: 'Update on Your Faculty Application – UCMS',
        html: rejectedTemplate(application.fullName),
      },
    };

    const emailPayload = statusEmailMap[application.status as ApplicationStatus];

    if (!emailPayload) return;

    await this.transporter.sendMail({
      from: fromEmail,
      to: application.email,
      ...emailPayload,
    });
  }

  private buildFromEmail(): string {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const appName = this.configService.get<string>('APP_NAME');
    return `${appName} <${smtpUser}>`;
  }
}