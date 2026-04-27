import { CourseModuleDocument } from '../entities/course-module.entity';
import { CreateCourseModuleDto } from '../dto/create-course-module.dto';
import { UpdateCourseModuleDto } from '../dto/update-course-module.dto';

export interface ICourseModuleService {
  createModule(courseId: string, dto: CreateCourseModuleDto): Promise<CourseModuleDocument>;
  getModulesByCourse(courseId: string): Promise<CourseModuleDocument[]>;
  getModuleById(id: string): Promise<CourseModuleDocument>;
  updateModule(id: string, dto: UpdateCourseModuleDto): Promise<CourseModuleDocument>;
  deleteModule(id: string): Promise<void>;
}