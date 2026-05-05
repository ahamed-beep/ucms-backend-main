import { StudentProgressResponseDto } from '../dto/student-progress-response.dto';

export interface IStudentProgressService {
  getStudentProgress(userId: string): Promise<StudentProgressResponseDto>;
}