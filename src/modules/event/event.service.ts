import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEntity, EventDocument } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import {
  IEvent,
  IEventListResponse,
  IDeleteResponse,
} from './interfaces/event.interface';
import { EventStatus } from './enums/event.enum';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateEventDto): Promise<IEvent> {
    try {
      const dateObj = new Date(dto.date);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const monthYear = dateObj.toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      });

      const event = new this.eventModel({
        ...dto,
        date: dateObj,
        day,
        monthYear,
        status: dto.status ?? EventStatus.REGISTRATIONS_OPEN,
        isActive: dto.isActive ?? true,
        highlights: dto.highlights ?? [],
      });

      return (await event.save()).toObject({ virtuals: true }) as unknown as IEvent;
    } catch (error: unknown) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<IEventListResponse> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.eventModel
          .find({ isActive: true })
          .sort({ date: 1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.eventModel.countDocuments({ isActive: true }),
      ]);

      return { data: data as unknown as IEvent[], total, page, limit };
    } catch (error: unknown) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async findAllAdmin(page: number = 1, limit: number = 10): Promise<IEventListResponse> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.eventModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.eventModel.countDocuments(),
      ]);

      return { data: data as unknown as IEvent[], total, page, limit };
    } catch (error: unknown) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async findOne(id: string): Promise<IEvent> {
    try {
      const event = await this.eventModel.findById(id).lean().exec();
      if (!event) throw new NotFoundException('Event not found');
      return event as unknown as IEvent;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException((error as Error).message);
    }
  }

  async update(id: string, dto: UpdateEventDto): Promise<IEvent> {
    try {
      const updatePayload: any = { ...dto };

      if (dto.date) {
        const dateObj = new Date(dto.date);
        updatePayload.date = dateObj;
        updatePayload.day = String(dateObj.getDate()).padStart(2, '0');
        updatePayload.monthYear = dateObj.toLocaleDateString('en-GB', {
          month: 'short',
          year: 'numeric',
        });
      }

      const updated = await this.eventModel
        .findByIdAndUpdate(id, updatePayload, { new: true })
        .lean()
        .exec();

      if (!updated) throw new NotFoundException('Event not found');
      return updated as unknown as IEvent;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException((error as Error).message);
    }
  }

  async updateStatus(id: string, dto: UpdateEventStatusDto): Promise<IEvent> {
    try {
      const updated = await this.eventModel
        .findByIdAndUpdate(id, { status: dto.status }, { new: true })
        .lean()
        .exec();

      if (!updated) throw new NotFoundException('Event not found');
      return updated as unknown as IEvent;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException((error as Error).message);
    }
  }

  async remove(id: string): Promise<IDeleteResponse> {
    try {
      const deleted = await this.eventModel.findByIdAndDelete(id).exec();
      if (!deleted) throw new NotFoundException('Event not found');
      return { message: 'Event deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException((error as Error).message);
    }
  }

  async incrementRegisteredCount(id: string): Promise<void> {
    try {
      await this.eventModel
        .findByIdAndUpdate(id, { $inc: { registeredCount: 1 } })
        .exec();
    } catch (error: unknown) {
      throw new BadRequestException((error as Error).message);
    }
  }
}