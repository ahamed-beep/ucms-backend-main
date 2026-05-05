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
import { Lecture, LectureDocument } from '../../modules/lecture/entities/lecture.entity';

@Injectable()
export class ModuleEnrollmentGuard implements CanActivate {
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(CourseModule.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,
    @InjectModel(Lecture.name)
    private readonly lectureModel: Model<LectureDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role === 'admin') return true;

    const moduleId = request.params?.moduleId;
    const lectureId = request.params?.lectureId;

    if (moduleId && Types.ObjectId.isValid(moduleId)) {
      return await this.checkByModuleId(moduleId, user.userId);
    }

    if (lectureId && Types.ObjectId.isValid(lectureId)) {
      const lecture = await this.lectureModel.findById(lectureId);
      if (!lecture) throw new NotFoundException('Lecture not found');
      return await this.checkByModuleId(lecture.courseModuleId.toString(), user.userId);
    }

    throw new NotFoundException('Module not found');
  }

  private async checkByModuleId(moduleId: string, userId: string): Promise<boolean> {
    const courseModule = await this.courseModuleModel.findById(moduleId);
    if (!courseModule) throw new NotFoundException('Module not found');

    const enrollment = await this.enrollmentModel.findOne({
      studentId: userId,
      courseId: courseModule.courseId,
      isActive: true,
    });

    if (!enrollment) throw new ForbiddenException('You are not enrolled in this course');

    return true;
  }
}