import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LectureAssignment, LectureAssignmentDocument } from './entities/lecture-assignment.entity';
import { LectureAssignmentSubmission, LectureAssignmentSubmissionDocument } from './entities/lecture-assignment-submission.entity';
import { CreateLectureAssignmentDto } from './dto/create-lecture-assignment.dto';
import { UpdateLectureAssignmentDto } from './dto/update-lecture-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { AssignmentStatus } from './enums/assignment.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ILectureAssignmentService } from './interfaces/lecture-assignment.service.interface';

@Injectable()
export class LectureAssignmentService implements ILectureAssignmentService {
  constructor(
    @InjectModel(LectureAssignment.name)
    private readonly assignmentModel: Model<LectureAssignmentDocument>,
    @InjectModel(LectureAssignmentSubmission.name)
    private readonly submissionModel: Model<LectureAssignmentSubmissionDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createAssignment(lectureId: string, dto: CreateLectureAssignmentDto): Promise<any> {
    try {
      const saved = await this.assignmentModel.create({
        lectureId: new Types.ObjectId(lectureId),
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        order: dto.order ?? 0,
      });
      return this.formatAssignment(saved, null);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create assignment');
    }
  }

  async updateAssignment(assignmentId: string, dto: UpdateLectureAssignmentDto): Promise<any> {
    try {
      const assignment = await this.assignmentModel.findById(assignmentId);
      if (!assignment) throw new NotFoundException('Assignment not found');
      Object.assign(assignment, {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : assignment.dueDate,
      });
      const saved = await assignment.save();
      return this.formatAssignment(saved, null);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update assignment');
    }
  }

  async deleteAssignment(assignmentId: string): Promise<void> {
    try {
      const result = await this.assignmentModel.findByIdAndDelete(assignmentId);
      if (!result) throw new NotFoundException('Assignment not found');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete assignment');
    }
  }

  async getAssignmentsForLectureAdmin(lectureId: string): Promise<any[]> {
    try {
      const assignments = await this.assignmentModel
        .find({ lectureId: new Types.ObjectId(lectureId) })
        .sort({ order: 1 });
      return assignments.map((a) => this.formatAssignment(a, null));
    } catch {
      throw new InternalServerErrorException('Failed to fetch assignments');
    }
  }

  async getAssignmentsForLecture(lectureId: string, userId: string): Promise<any[]> {
    try {
      const assignments = await this.assignmentModel
        .find({ lectureId: new Types.ObjectId(lectureId) })
        .sort({ order: 1 });

      const submissions = await this.submissionModel.find({
        lectureAssignmentId: { $in: assignments.map((a) => a._id) },
        userId: new Types.ObjectId(userId),
      });

      const submissionMap = new Map(
        submissions.map((s) => [s.lectureAssignmentId.toString(), s]),
      );

      return assignments.map((a) => {
        const submission = submissionMap.get((a._id as Types.ObjectId).toString());
        return this.formatAssignment(a, submission ?? null);
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch assignments');
    }
  }

  async submitAssignment(
    assignmentId: string,
    userId: string,
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<any> {
    try {
      const assignment = await this.assignmentModel.findById(assignmentId);
      if (!assignment) throw new NotFoundException('Assignment not found');

      const existing = await this.submissionModel.findOne({
        lectureAssignmentId: new Types.ObjectId(assignmentId),
        userId: new Types.ObjectId(userId),
      });
      if (existing) throw new ConflictException('Assignment already submitted');

      const uploaded = await this.cloudinaryService.uploadCV(
        fileBuffer,
        fileName,
        'courses/assignments',
      );

      const submission = await this.submissionModel.create({
        lectureAssignmentId: new Types.ObjectId(assignmentId),
        userId: new Types.ObjectId(userId),
        fileUrl: uploaded.secureUrl,
        filePublicId: uploaded.publicId,
        status: AssignmentStatus.SUBMITTED,
      });

      return this.formatSubmission(submission);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to submit assignment');
    }
  }

  async gradeSubmission(
    assignmentId: string,
    userId: string,
    dto: GradeSubmissionDto,
  ): Promise<any> {
    try {
      const submission = await this.submissionModel.findOne({
        lectureAssignmentId: new Types.ObjectId(assignmentId),
        userId: new Types.ObjectId(userId),
      });
      if (!submission) throw new NotFoundException('Submission not found');

      submission.grade = dto.grade;
      submission.feedback = dto.feedback ?? null;
      submission.status = AssignmentStatus.GRADED;
      const saved = await submission.save();

      return this.formatSubmission(saved);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to grade submission');
    }
  }

  async getSubmissionsForAssignment(assignmentId: string): Promise<any[]> {
    try {
      const submissions = await this.submissionModel
        .find({ lectureAssignmentId: new Types.ObjectId(assignmentId) })
        .populate('userId', 'firstName lastName emailId')
        .lean();

      return submissions.map((s) => this.formatSubmission(s as any));
    } catch {
      throw new InternalServerErrorException('Failed to fetch submissions');
    }
  }

  private formatAssignment(
    assignment: LectureAssignmentDocument,
    submission: LectureAssignmentSubmissionDocument | null,
  ): any {
    return {
      id: (assignment._id as Types.ObjectId).toString(),
      lectureId: assignment.lectureId.toString(),
      title: assignment.title,
      description: assignment.description ?? null,
      dueDate: assignment.dueDate ?? null,
      order: assignment.order,
      status: submission ? submission.status : AssignmentStatus.PENDING,
      submittedAt: submission ? (submission as any).createdAt : null,
      grade: submission?.grade ?? null,
      feedback: submission?.feedback ?? null,
      fileUrl: submission?.fileUrl ?? null,
      createdAt: (assignment as any).createdAt,
    };
  }

  private formatSubmission(submission: any): any {
    const raw = submission.userId;
    const userObj =
      raw && typeof raw === 'object' && !(raw instanceof Types.ObjectId)
        ? {
            _id: raw._id?.toString() ?? '',
            name: [raw.firstName, raw.lastName].filter(Boolean).join(' ') || null,
            email: raw.emailId ?? raw.email ?? null, // ✅ FIX: emailId pehle check karo
          }
        : {
            _id: raw?.toString() ?? '',
            name: null,
            email: null,
          };

    return {
      id: submission._id?.toString(),
      lectureAssignmentId: submission.lectureAssignmentId?.toString(),
      userId: userObj,
      fileUrl: submission.fileUrl,
      status: submission.status,
      grade: submission.grade ?? null,
      feedback: submission.feedback ?? null,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    };
  }
}