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

async getMyEnrollments(studentId: string): Promise<EnrollmentDocument[]> {
  try {
    console.log('🔍 studentId received:', studentId);
    console.log('🔍 studentId type:', typeof studentId);

    // Check ALL enrollments first (no filter)
    const allEnrollments = await this.enrollmentModel.find().lean();
    console.log('📦 ALL enrollments in DB:', JSON.stringify(allEnrollments));
    console.log('📊 Total enrollments in DB:', allEnrollments.length);

    // Check what studentId field looks like in DB
    if (allEnrollments.length > 0) {
      console.log('🔑 Sample studentId from DB:', allEnrollments[0].studentId);
      console.log('🔑 Sample studentId type:', typeof allEnrollments[0].studentId);
    }

    // Now try the actual query
    const result = await this.enrollmentModel
      .find({ studentId, isActive: true })
      .lean();
    console.log('✅ Query result:', JSON.stringify(result));
    console.log('📊 Query result count:', result.length);

    // Try without isActive filter
    const withoutActive = await this.enrollmentModel
      .find({ studentId })
      .lean();
    console.log('🔎 Without isActive filter:', JSON.stringify(withoutActive));
    console.log('📊 Without isActive count:', withoutActive.length);

    return await this.enrollmentModel
      .find({ studentId, isActive: true })
      .populate('courseId')
      .lean();
  } catch (err) {
    console.error('❌ Error:', err);
    throw new InternalServerErrorException('Failed to fetch enrollments');
  }
}
}