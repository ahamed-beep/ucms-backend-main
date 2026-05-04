import { CreateLectureAssignmentDto } from '../dto/create-lecture-assignment.dto';
import { UpdateLectureAssignmentDto } from '../dto/update-lecture-assignment.dto';
import { GradeSubmissionDto } from '../dto/grade-submission.dto';

export interface ILectureAssignmentService {
  createAssignment(lectureId: string, dto: CreateLectureAssignmentDto): Promise<any>;
  updateAssignment(assignmentId: string, dto: UpdateLectureAssignmentDto): Promise<any>;
  deleteAssignment(assignmentId: string): Promise<void>;
  getAssignmentsForLectureAdmin(lectureId: string): Promise<any[]>;
  getAssignmentsForLecture(lectureId: string, userId: string): Promise<any[]>;
  submitAssignment(assignmentId: string, userId: string, fileBuffer: Buffer, fileName: string): Promise<any>;
  gradeSubmission(assignmentId: string, userId: string, dto: GradeSubmissionDto): Promise<any>;
  getSubmissionsForAssignment(assignmentId: string): Promise<any[]>;
}