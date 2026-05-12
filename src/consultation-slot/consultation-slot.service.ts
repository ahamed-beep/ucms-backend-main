import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConsultationSlot,
  ConsultationSlotDocument,
} from './entities/consultation-slot.entity';
import {
  CreateConsultationSlotDto,
  UpdateConsultationSlotDto,
} from './dto/consultation-slot.dto';

@Injectable()
export class ConsultationSlotService {
  constructor(
    @InjectModel(ConsultationSlot.name)
    private readonly slotModel: Model<ConsultationSlotDocument>,
  ) {}

  // Admin: create a slot with date + times
  async create(dto: CreateConsultationSlotDto): Promise<ConsultationSlotDocument> {
    try {
      return await this.slotModel.create({
        ...dto,
        isActive: dto.isActive ?? true,
      });
    } catch {
      throw new InternalServerErrorException('Failed to create slot');
    }
  }

  // Admin: get all slots
  async findAll(): Promise<ConsultationSlotDocument[]> {
    try {
      return await this.slotModel.find().sort({ createdAt: -1 });
    } catch {
      throw new InternalServerErrorException('Failed to fetch slots');
    }
  }

  // Public: get only active slots (for booking form)
  async findActive(): Promise<ConsultationSlotDocument[]> {
    try {
      return await this.slotModel
        .find({ isActive: true })
        .sort({ createdAt: 1 });
    } catch {
      throw new InternalServerErrorException('Failed to fetch active slots');
    }
  }

  // Admin: update a slot (change date, times, or toggle active)
  async update(
    id: string,
    dto: UpdateConsultationSlotDto,
  ): Promise<ConsultationSlotDocument> {
    try {
      const slot = await this.slotModel.findByIdAndUpdate(id, dto, {
        new: true,
      });
      if (!slot) throw new NotFoundException('Slot not found');
      return slot;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update slot');
    }
  }

  // Admin: delete a slot
  async delete(id: string): Promise<void> {
    try {
      const slot = await this.slotModel.findByIdAndDelete(id);
      if (!slot) throw new NotFoundException('Slot not found');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete slot');
    }
  }
}