import { EnrollmentDocument } from '../entities/enrollment.entity';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';

export interface IEnrollmentService {
  enrollStudent(dto: CreateEnrollmentDto): Promise<EnrollmentDocument>;
  toggleEnrollment(enrollmentId: string): Promise<EnrollmentDocument>;
  getEnrollmentsByStudent(studentId: string): Promise<EnrollmentDocument[]>;
  getEnrollmentsByCourse(courseId: string): Promise<EnrollmentDocument[]>;
  isStudentEnrolledInCourse(studentId: string, courseId: string): Promise<boolean>;
  deleteEnrollment(id: string): Promise<void>;
}