import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollment, EnrollmentDocument } from '../../modules/enrollment/entities/enrollment.entity';

@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role === 'admin') {
      return true;
    }

    const courseId = request.params?.courseId ?? request.params?.id;

    if (!courseId || !Types.ObjectId.isValid(courseId)) {
      throw new NotFoundException('Course not found');
    }

    const enrollment = await this.enrollmentModel.findOne({
      studentId: user.userId,
      courseId,
      isActive: true,
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this course');
    }

    return true;
  }
}