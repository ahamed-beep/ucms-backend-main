import { CourseDocument } from '../entities/course.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

export interface ICourseService {
  createCourse(
    dto: CreateCourseDto,
    thumbnailBuffer?: Buffer,
    thumbnailName?: string,
  ): Promise<CourseDocument>;

  getAllCourses(): Promise<CourseDocument[]>;
  getCourseById(id: string): Promise<CourseDocument>;

  updateCourse(
    id: string,
    dto: UpdateCourseDto,
    thumbnailBuffer?: Buffer,
    thumbnailName?: string,
  ): Promise<CourseDocument>;

  deleteCourse(id: string): Promise<void>;
}