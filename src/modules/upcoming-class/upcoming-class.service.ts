import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpcomingClass, UpcomingClassDocument } from './entities/upcoming-class.entity';

import {
  IUpcomingClass,
  IUpcomingClassPaginated,
} from './interfaces/upcoming-class.interfaces';
import { ClassStatus } from './enums/upcoming-class.enums';
import { CreateUpcomingClassDto } from './dto/create-upcoming-class.dto';
import { UpcomingClassQueryDto } from './dto/upcoming-class-query.dto';
import { UpdateUpcomingClassDto } from './dto/update-upcoming-class-dto';

@Injectable()
export class UpcomingClassService {
  constructor(
    @InjectModel(UpcomingClass.name)
    private readonly upcomingClassModel: Model<UpcomingClassDocument>,
  ) {}

  async create(dto: CreateUpcomingClassDto): Promise<IUpcomingClass> {
    try {
      const created = await this.upcomingClassModel.create({
        ...dto,
        status: dto.status ?? ClassStatus.ACTIVE,
      });
      return this.toItem(created);
    } catch {
      throw new InternalServerErrorException('Failed to create class');
    }
  }

  async findAll(query: UpcomingClassQueryDto): Promise<IUpcomingClassPaginated> {
    try {
      const { status, type, mode, page = 1, limit = 10 } = query;
      const filter: Record<string, unknown> = {};

      if (status) filter.status = status;
      if (type) filter.type = type;
      if (mode) filter.mode = mode;

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.upcomingClassModel
          .find(filter)
          .sort({ date: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.upcomingClassModel.countDocuments(filter),
      ]);

      return {
        data: data.map((d) => this.toItem(d as UpcomingClassDocument)),
        total,
        page,
        limit,
      };
    } catch {
      throw new InternalServerErrorException('Failed to fetch classes');
    }
  }

  async findOne(id: string): Promise<IUpcomingClass> {
    try {
      const doc = await this.upcomingClassModel.findById(id).lean();
      if (!doc) throw new NotFoundException('Class not found');
      return this.toItem(doc as UpcomingClassDocument);
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch class');
    }
  }

  async update(id: string, dto: UpdateUpcomingClassDto): Promise<IUpcomingClass> {
    try {
      const updated = await this.upcomingClassModel
        .findByIdAndUpdate(id, dto, { new: true })
        .lean();
      if (!updated) throw new NotFoundException('Class not found');
      return this.toItem(updated as UpcomingClassDocument);
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update class');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const deleted = await this.upcomingClassModel.findByIdAndDelete(id);
      if (!deleted) throw new NotFoundException('Class not found');
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete class');
    }
  }

  private toItem(doc: UpcomingClassDocument | any): IUpcomingClass {
    return {
      id: doc._id.toString(),
      title: doc.title,
      date: doc.date,
      totalSpots: doc.totalSpots,
      spotsLeft: doc.spotsLeft,
      type: doc.type,
      mode: doc.mode,
      location: doc.location,
      instructor: doc.instructor,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}