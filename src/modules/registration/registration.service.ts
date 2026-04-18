import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MailService } from './mail.service';
import {
  RegistrationEntity,
  RegistrationDocument,
} from './entities/registration.entity';
import { EventService } from '../event/event.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';
import {
  IRegistration,
  IRegistrationListResponse,
  IRegistrationMailPayload,
} from './interfaces/registration.interface';
import { RegistrationStatus } from './enums/registration.enum';
import { attendeeConfirmationTemplate } from './templates/attendee-confirmation.template';
import { adminNotificationTemplate } from './templates/admin-notification.template';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(RegistrationEntity.name)
    private readonly registrationModel: Model<RegistrationDocument>,
    private readonly eventService: EventService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateRegistrationDto): Promise<IRegistration> {
    try {
      const event = await this.eventService.findOne(dto.eventId);

      const registration = new this.registrationModel({
        ...dto,
        eventId: new Types.ObjectId(dto.eventId),
        status: RegistrationStatus.NEW,
      });

      const saved = await registration.save();

      await this.eventService.incrementRegisteredCount(dto.eventId);

      const mailPayload: IRegistrationMailPayload = {
        attendeeName: `${dto.firstName} ${dto.lastName}`,
        attendeeEmail: dto.email,
        attendeePhone: dto.phone,
        eventTitle: event.title,
        eventDate: new Date(event.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        eventTime: `${event.startTime} - ${event.endTime}`,
        eventLocation: event.location,
        attendees: dto.attendees,
      };

      await this.sendAttendeeConfirmation(mailPayload);
      await this.sendAdminNotification(mailPayload);

      return saved.toObject({ virtuals: true }) as unknown as IRegistration;
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new BadRequestException((error as Error).message);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<IRegistrationListResponse> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.registrationModel
          .find()
        .populate('eventId', 'title date day monthYear startTime endTime location tag status')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.registrationModel.countDocuments(),
      ]);

      return { data: data as unknown as IRegistration[], total, page, limit };
    } catch (error: unknown) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async findByEvent(
    eventId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<IRegistrationListResponse> {
    try {
      const skip = (page - 1) * limit;
      const objectId = new Types.ObjectId(eventId);

      const [data, total] = await Promise.all([
        this.registrationModel
          .find({ eventId: objectId })
       .populate('eventId', 'title date day monthYear startTime endTime location tag status')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.registrationModel.countDocuments({ eventId: objectId }),
      ]);

      return { data: data as unknown as IRegistration[], total, page, limit };
    } catch (error: unknown) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<IRegistration> {
    try {
      const registration = await this.registrationModel
        .findById(id)
      .populate('eventId', 'title date day monthYear startTime endTime location tag status')
        .lean()
        .exec();

      if (!registration) throw new NotFoundException('Registration not found');
      return registration as unknown as IRegistration;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException((error as Error).message);
    }
  }

  async updateStatus(
    id: string,
    dto: UpdateRegistrationStatusDto,
  ): Promise<IRegistration> {
    try {
      const updated = await this.registrationModel
        .findByIdAndUpdate(id, { status: dto.status }, { new: true })
       .populate('eventId', 'title date day monthYear startTime endTime location tag status')
        .lean()
        .exec();

      if (!updated) throw new NotFoundException('Registration not found');
      return updated as unknown as IRegistration;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException((error as Error).message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const deleted = await this.registrationModel.findByIdAndDelete(id).exec();
      if (!deleted) throw new NotFoundException('Registration not found');
      return { message: 'Registration deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException((error as Error).message);
    }
  }

  private async sendAttendeeConfirmation(payload: IRegistrationMailPayload): Promise<void> {
    try {
      await this.mailService.sendMail({
        to: payload.attendeeEmail,
        subject: `Registration Confirmed – ${payload.eventTitle}`,
        html: attendeeConfirmationTemplate(payload),
      });
    } catch {}
  }

  private async sendAdminNotification(payload: IRegistrationMailPayload): Promise<void> {
    try {
      await this.mailService.sendMail({
        to: process.env.SMTP_USER,
        subject: `New Registration – ${payload.eventTitle}`,
        html: adminNotificationTemplate(payload),
      });
    } catch {}
  }
}