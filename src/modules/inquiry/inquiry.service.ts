import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Inquiry, InquiryDocument } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { IDeleteResponse } from './interfaces/inquiry.interface';
import { inquiryUserEmailTemplate, inquiryAdminEmailTemplate } from './templates/inquiry.template';

@Injectable()
export class InquiryService {
  constructor(
    @InjectModel(Inquiry.name)
    private readonly inquiryModel: Model<InquiryDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async create(dto: CreateInquiryDto): Promise<InquiryDocument> {
    try {
      const inquiry = new this.inquiryModel(dto);
      const saved = await inquiry.save();

      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'We received your inquiry',
        html: inquiryUserEmailTemplate(dto.name),
      });

      await this.mailerService.sendMail({
        to: process.env.SMTP_USER,
        subject: 'New Inquiry Submitted',
        html: inquiryAdminEmailTemplate({
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          destination: dto.destination,
          qualification: dto.qualification,
          test: dto.test,
        }),
      });

      return saved;
    } catch (error: unknown) {
      console.error('INQUIRY ERROR:', error);
    }
  }

  async findAll(): Promise<InquiryDocument[]> {
    try {
      return await this.inquiryModel.find().sort({ createdAt: -1 }).exec();
    } catch (error: unknown) {
      throw error;
    }
  }

  async findOne(id: string): Promise<InquiryDocument> {
    try {
      const inquiry = await this.inquiryModel.findById(id).exec();
      if (!inquiry) throw new NotFoundException('Inquiry not found');
      return inquiry;
    } catch (error: unknown) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateInquiryDto): Promise<InquiryDocument> {
    try {
      const updated = await this.inquiryModel
        .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
        .exec();
      if (!updated) throw new NotFoundException('Inquiry not found');
      return updated;
    } catch (error: unknown) {
      throw error;
    }
  }

  async remove(id: string): Promise<IDeleteResponse> {
    try {
      const deleted = await this.inquiryModel.findByIdAndDelete(id).exec();
      if (!deleted) throw new NotFoundException('Inquiry not found');
      return { success: true, message: 'Inquiry deleted successfully' };
    } catch (error: unknown) {
      throw error;
    }
  }
}