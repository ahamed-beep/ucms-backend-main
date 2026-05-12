import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { IApplicationService } from './interfaces/application.service.interface';

@Injectable()
export class ApplicationService implements IApplicationService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationDocument>,
  ) {}

async createApplication(dto: CreateApplicationDto): Promise<ApplicationDocument> {
  try {
    const { studentId, ...rest } = dto;
    const application = new this.applicationModel({
      ...rest,
      userId: new Types.ObjectId(studentId),
    });
    const saved = await application.save();
    // lean object return karo taake userId string ho
    const result = await this.applicationModel.findById(saved._id).lean();
    return result as any;
  } catch {
    throw new InternalServerErrorException('Failed to create application');
  }
}

 async getAllApplications(): Promise<ApplicationDocument[]> {
  try {
    return await this.applicationModel
      .find()
      .populate('userId', 'firstName lastName emailId')
      .sort({ createdAt: -1 })
      .lean() as any;
  } catch {
    throw new InternalServerErrorException('Failed to fetch applications');
  }
}

  async getMyApplications(userId: string): Promise<ApplicationDocument[]> {
  try {
    return await this.applicationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean() as any;
  } catch {
    throw new InternalServerErrorException('Failed to fetch applications');
  }
}

  async getApplicationById(id: string): Promise<ApplicationDocument> {
    try {
      const application = await this.applicationModel.findById(id).lean();
      if (!application) throw new NotFoundException('Application not found');
      return application as any;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch application');
    }
  }

  async updateApplication(id: string, dto: UpdateApplicationDto): Promise<ApplicationDocument> {
    try {
      const application = await this.applicationModel.findById(id);
      if (!application) throw new NotFoundException('Application not found');
      Object.assign(application, dto);
      return await application.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update application');
    }
  }

  async updateApplicationStatus(id: string, dto: UpdateApplicationStatusDto): Promise<ApplicationDocument> {
    try {
      const application = await this.applicationModel.findById(id);
      if (!application) throw new NotFoundException('Application not found');
      application.status = dto.status;
      return await application.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update application status');
    }
  }

  async deleteApplication(id: string): Promise<void> {
    try {
      const application = await this.applicationModel.findById(id);
      if (!application) throw new NotFoundException('Application not found');
      await application.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete application');
    }
  }
}