import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Consultation, ConsultationDocument } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { ConsultationStatus } from './enums/consultation-status.enum';
import { UpdateConsultationStatusDto } from './dto/consultation-list-response.dto';
import { userBookingConfirmationTemplate } from './templates/user-booking-confirmation.template';
import { adminNewBookingTemplate } from './templates/admin-new-booking.template';
import { statusUpdatedTemplate } from './templates/status-updated.template';

@Injectable()
export class ConsultationService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Consultation.name)
    private readonly consultationModel: Model<ConsultationDocument>,
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

  async create(dto: CreateConsultationDto): Promise<ConsultationDocument> {
    try {
      const consultation = await this.consultationModel.create(dto);
      await this.sendUserConfirmationEmail(consultation);
      await this.sendAdminNotificationEmail(consultation);
      return consultation;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create consultation');
    }
  }

  async findAll(): Promise<ConsultationDocument[]> {
    try {
      return await this.consultationModel.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch consultations');
    }
  }

  async findById(id: string): Promise<ConsultationDocument> {
    try {
      const consultation = await this.consultationModel.findById(id);
      if (!consultation) throw new NotFoundException('Consultation not found');
      return consultation;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch consultation');
    }
  }

  async findUnread(): Promise<ConsultationDocument[]> {
    try {
      return await this.consultationModel
        .find({ status: ConsultationStatus.UNREAD })
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch unread consultations');
    }
  }

  async findRead(): Promise<ConsultationDocument[]> {
    try {
      return await this.consultationModel
        .find({ status: ConsultationStatus.READ })
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch read consultations');
    }
  }

  async updateStatus(
    id: string,
    dto: UpdateConsultationStatusDto,
  ): Promise<ConsultationDocument> {
    try {
      const consultation = await this.consultationModel.findByIdAndUpdate(
        id,
        { status: dto.status },
        { new: true },
      );
      if (!consultation) throw new NotFoundException('Consultation not found');
      await this.sendStatusUpdateEmail(consultation);
      return consultation;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update consultation status');
    }
  }

  async delete(id: string): Promise<void> {
  try {
    const consultation = await this.consultationModel.findByIdAndDelete(id);
    if (!consultation) throw new NotFoundException('Consultation not found');
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Failed to delete consultation');
  }
}

  private async sendUserConfirmationEmail(
    consultation: ConsultationDocument,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('SMTP_USER')}>`,
      to: consultation.email,
      subject: '✅ Your Consultation is Confirmed – UCMS',
      html: userBookingConfirmationTemplate({
        fullName: consultation.fullName,
        selectedDate: consultation.selectedDate,
        selectedTime: consultation.selectedTime,
        consultationType: consultation.consultationType,
        destination: consultation.destination,
      }),
    });
  }

  private async sendAdminNotificationEmail(
    consultation: ConsultationDocument,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('SMTP_USER')}>`,
      to: this.configService.get<string>('SMTP_USER'),
      subject: `🔔 New Consultation – ${consultation.fullName}`,
      html: adminNewBookingTemplate({
        fullName: consultation.fullName,
        email: consultation.email,
        phone: consultation.phone,
        selectedDate: consultation.selectedDate,
        selectedTime: consultation.selectedTime,
        consultationType: consultation.consultationType,
        destination: consultation.destination,
        qualification: consultation.qualification,
        additionalInfo: consultation.additionalInfo,
      }),
    });
  }

  private async sendStatusUpdateEmail(
    consultation: ConsultationDocument,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('SMTP_USER')}>`,
      to: consultation.email,
      subject: `📋 Your Consultation Status Has Been Updated – UCMS`,
      html: statusUpdatedTemplate({
        fullName: consultation.fullName,
        selectedDate: consultation.selectedDate,
        selectedTime: consultation.selectedTime,
        consultationType: consultation.consultationType,
        newStatus: consultation.status,
      }),
    });
  }
}