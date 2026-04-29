import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { IEnrollmentService } from './interfaces/enrollment.service.interface';

@Injectable()
export class EnrollmentService implements IEnrollmentService {
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async enrollStudent(dto: CreateEnrollmentDto): Promise<EnrollmentDocument> {
    try {
      const existing = await this.enrollmentModel.findOne({
        studentId: dto.studentId,
        courseId: dto.courseId,
      });

      if (existing) {
        throw new ConflictException('Student is already enrolled in this course');
      }

      const enrollment = new this.enrollmentModel(dto);
      return await enrollment.save();
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to enroll student');
    }
  }

  async toggleEnrollment(enrollmentId: string): Promise<EnrollmentDocument> {
    try {
      const enrollment = await this.enrollmentModel.findById(enrollmentId);

      if (!enrollment) {
        throw new NotFoundException(`Enrollment with id "${enrollmentId}" not found`);
      }

      enrollment.isActive = !enrollment.isActive;
      return await enrollment.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to toggle enrollment status');
    }
  }

async getEnrollmentsByStudent(studentId: string): Promise<EnrollmentDocument[]> {
  try {
    return await this.enrollmentModel
      .find({ studentId, isActive: true })
      .populate('courseId');  
  } catch {
    throw new InternalServerErrorException('Failed to fetch enrollments');
  }
}

  async getEnrollmentsByCourse(courseId: string): Promise<EnrollmentDocument[]> {
    try {
      return await this.enrollmentModel
        .find({ courseId })
        .populate('studentId', '-password');
    } catch {
      throw new InternalServerErrorException('Failed to fetch enrollments');
    }
  }

  async getAllEnrollments(): Promise<EnrollmentDocument[]> {
  try {
    return await this.enrollmentModel
      .find()
      .populate('studentId', '-password')
      .populate('courseId')
      .sort({ createdAt: -1 });
  } catch {
    throw new InternalServerErrorException('Failed to fetch enrollments');
  }
}

  async isStudentEnrolledInCourse(studentId: string, courseId: string): Promise<boolean> {
    try {
      const enrollment = await this.enrollmentModel.findOne({
        studentId,
        courseId,
        isActive: true,
      });
      return !!enrollment;
    } catch {
      throw new InternalServerErrorException('Failed to check enrollment');
    }
  }
  async deleteEnrollment(id: string): Promise<void> {
  try {
    const enrollment = await this.enrollmentModel.findById(id);
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    await enrollment.deleteOne();
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Failed to delete enrollment');
  }
}
}