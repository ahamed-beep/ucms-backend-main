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
import { CourseModule, CourseModuleDocument } from '../../modules/course-module/entities/course-module.entity';

@Injectable()
export class ModuleEnrollmentGuard implements CanActivate {
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(CourseModule.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role === 'admin') {
      return true;
    }

    const moduleId = request.params?.moduleId;

    if (!moduleId || !Types.ObjectId.isValid(moduleId)) {
      throw new NotFoundException('Module not found');
    }

    const courseModule = await this.courseModuleModel.findById(moduleId);

    if (!courseModule) {
      throw new NotFoundException('Module not found');
    }

    const enrollment = await this.enrollmentModel.findOne({
      studentId: user.userId,
      courseId: courseModule.courseId,
      isActive: true,
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this course');
    }

    return true;
  }
}