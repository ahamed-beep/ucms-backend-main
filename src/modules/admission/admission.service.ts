import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdmissionDeadline, AdmissionDeadlineDocument } from './entities/admission-deadline.entity';
import { CreateAdmissionDeadlineDto } from './dto/create-admission-deadline.dto';
import { UpdateAdmissionDeadlineDto } from './dto/update-admission-deadline.dto';
import { IDeleteResponse } from './interfaces/admission-deadline.interface';

@Injectable()
export class AdmissionDeadlineService {
  constructor(
    @InjectModel(AdmissionDeadline.name)
    private readonly admissionDeadlineModel: Model<AdmissionDeadlineDocument>,
  ) {}

  async create(dto: CreateAdmissionDeadlineDto): Promise<AdmissionDeadlineDocument> {
    try {
      const created = new this.admissionDeadlineModel(dto);
      return await created.save();
    } catch (error: unknown) {
      throw error;
    }
  }

  async findAll(): Promise<AdmissionDeadlineDocument[]> {
    try {
      return await this.admissionDeadlineModel
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error: unknown) {
      throw error;
    }
  }

  async findAllAdmin(): Promise<AdmissionDeadlineDocument[]> {
    try {
      return await this.admissionDeadlineModel.find().sort({ createdAt: -1 }).exec();
    } catch (error: unknown) {
      throw error;
    }
  }

  async findOne(id: string): Promise<AdmissionDeadlineDocument> {
    try {
      const record = await this.admissionDeadlineModel.findById(id).exec();
      if (!record) throw new NotFoundException('Admission deadline not found');
      return record;
    } catch (error: unknown) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateAdmissionDeadlineDto): Promise<AdmissionDeadlineDocument> {
    try {
      const updated = await this.admissionDeadlineModel
        .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
        .exec();
      if (!updated) throw new NotFoundException('Admission deadline not found');
      return updated;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<AdmissionDeadlineDocument> {
    try {
      const record = await this.admissionDeadlineModel.findById(id).exec();
      if (!record) throw new NotFoundException('Admission deadline not found');
      record.isActive = !record.isActive;
      return await record.save();
    } catch (error: unknown) {
      throw error;
    }
  }

  async remove(id: string): Promise<IDeleteResponse> {
    try {
      const deleted = await this.admissionDeadlineModel.findByIdAndDelete(id).exec();
      if (!deleted) throw new NotFoundException('Admission deadline not found');
      return { success: true, message: 'Admission deadline deleted successfully' };
    } catch (error: unknown) {
      throw error;
    }
  }
}