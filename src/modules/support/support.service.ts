import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Support, SupportDocument } from './entities/support.entity';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportStatusDto } from './dto/update-support-status.dto';
import { ISupportService } from './interfaces/support.service.interface';
import { supportUserTemplate } from './templates/support-user.template';
import { supportAdminTemplate } from './templates/support-admin.template';

@Injectable()
export class SupportService implements ISupportService {
  constructor(
    @InjectModel(Support.name)
    private readonly supportModel: Model<SupportDocument>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateSupportDto): Promise<SupportDocument> {
    try {
      const support = await this.supportModel.create(dto);

      const adminEmail = this.configService.get<string>('SMTP_USER');

      await this.mailerService.sendMail({
        to: dto.email,
        subject: `Support Request Received: ${dto.subject}`,
        html: supportUserTemplate(dto.fullName, dto.subject, dto.message),
      });

      await this.mailerService.sendMail({
        to: adminEmail,
        subject: `New Support Request from ${dto.fullName}`,
        html: supportAdminTemplate(dto.fullName, dto.email, dto.subject, dto.message),
      });

      return support;
    } catch {
      throw new InternalServerErrorException('Failed to submit support request');
    }
  }

  async findAll(): Promise<SupportDocument[]> {
    try {
      return await this.supportModel.find().sort({ createdAt: -1 }).lean() as any;
    } catch {
      throw new InternalServerErrorException('Failed to fetch support requests');
    }
  }

  async findById(id: string): Promise<SupportDocument> {
    try {
      const support = await this.supportModel.findById(id).lean();
      if (!support) throw new NotFoundException('Support request not found');
      return support as any;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch support request');
    }
  }

  async updateStatus(id: string, dto: UpdateSupportStatusDto): Promise<SupportDocument> {
    try {
      const support = await this.supportModel.findById(id);
      if (!support) throw new NotFoundException('Support request not found');
      support.status = dto.status;
      return await support.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update status');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const support = await this.supportModel.findById(id);
      if (!support) throw new NotFoundException('Support request not found');
      await support.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete support request');
    }
  }
}