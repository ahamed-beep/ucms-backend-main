import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClassSession, ClassSessionDocument } from './entities/class-session.entity';
import { ClassAttendance, ClassAttendanceDocument } from './entities/class-attendance.entity';
import { Enrollment, EnrollmentDocument } from '../enrollment/entities/enrollment.entity';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';

@Injectable()
export class ClassSessionService {
  constructor(
    @InjectModel(ClassSession.name)
    private readonly classSessionModel: Model<ClassSessionDocument>,
    @InjectModel(ClassAttendance.name)
    private readonly classAttendanceModel: Model<ClassAttendanceDocument>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async createClassSession(dto: CreateClassSessionDto): Promise<ClassSessionDocument> {
    try {
        const session = new this.classSessionModel({
      ...dto,
      scheduledAt: new Date(`${dto.scheduledAt}Z`), 
    });
      return await session.save();
    } catch {
      throw new InternalServerErrorException('Failed to create class session');
    }
  }

  async getAllSessions(): Promise<any[]> {
    try {
      return await this.classSessionModel
        .find()
        .populate('courseId')
        .sort({ scheduledAt: -1 })
        .lean();
    } catch {
      throw new InternalServerErrorException('Failed to fetch sessions');
    }
  }

  async getMySchedule(studentId: string): Promise<any[]> {
    try {
      const courseObjectIds = await this.getEnrolledCourseObjectIds(studentId);
      const courseIdStrings = courseObjectIds.map((id) => id.toString());

      const sessions = await this.classSessionModel
        .find({
          courseId: { $in: courseIdStrings },
          scheduledAt: { $gte: new Date() },
          isActive: true,
        })
        .populate('courseId')
        .sort({ scheduledAt: 1 })
        .lean();

      const attendedIds = await this.getAttendedSessionIds(studentId);
      return sessions.map((s) => ({
        ...s,
        attended: attendedIds.has(s._id.toString()),
      }));
    } catch {
      throw new InternalServerErrorException('Failed to fetch schedule');
    }
  }

  async getWeeklySchedule(studentId: string): Promise<Record<string, any[]>> {
    try {
      const courseObjectIds = await this.getEnrolledCourseObjectIds(studentId);
      const courseIdStrings = courseObjectIds.map((id) => id.toString());

      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const sessions = await this.classSessionModel
        .find({
          courseId: { $in: courseIdStrings },
          scheduledAt: { $gte: weekStart, $lt: weekEnd },
          isActive: true,
        })
        .populate('courseId')
        .sort({ scheduledAt: 1 })
        .lean();

      const attendedIds = await this.getAttendedSessionIds(studentId);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const grouped: Record<string, any[]> = {};

      for (const s of sessions) {
        const session = { ...s, attended: attendedIds.has(s._id.toString()) };
        const day = days[new Date(s.scheduledAt).getDay()];
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(session);
      }

      return grouped;
    } catch {
      throw new InternalServerErrorException('Failed to fetch weekly schedule');
    }
  }

  async getClassSessionById(id: string, studentId?: string): Promise<ClassSessionDocument> {
    try {
      const session = await this.classSessionModel.findById(id).populate('courseId');
      if (!session) throw new NotFoundException('Class session not found');

      if (studentId) {
        const attended = await this.classAttendanceModel.findOne({ classSessionId: id, studentId });
        (session as any).attended = !!attended;
      }

      return session;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch class session');
    }
  }

  async joinClass(
    classSessionId: string,
    studentId: string,
  ): Promise<{ meetingLink: string; alreadyAttended: boolean }> {
    try {
      const session = await this.classSessionModel.findById(classSessionId).lean();
      if (!session) throw new NotFoundException('Class session not found');

      const enrollment = await this.enrollmentModel.findOne({
        studentId,
        courseId: session.courseId.toString(),
        isActive: true,
      });

      if (!enrollment) throw new ForbiddenException('You are not enrolled in this course');

      const existing = await this.classAttendanceModel.findOne({ studentId, classSessionId });
      if (existing) return { meetingLink: session.meetingLink, alreadyAttended: true };

      await this.classAttendanceModel.create({ studentId, classSessionId, joinedAt: new Date() });
      return { meetingLink: session.meetingLink, alreadyAttended: false };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Failed to join class');
    }
  }

  async getMyProgress(studentId: string): Promise<{
    totalClasses: number;
    attendedClasses: number;
    percentage: number;
  }> {
    try {
      const courseObjectIds = await this.getEnrolledCourseObjectIds(studentId);
      const courseIdStrings = courseObjectIds.map((id) => id.toString());

      const [totalClasses, attendedClasses] = await Promise.all([
        this.classSessionModel.countDocuments({
          courseId: { $in: courseIdStrings },
          isActive: true,
        }),
        this.classAttendanceModel.countDocuments({ studentId }),
      ]);

      const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
      return { totalClasses, attendedClasses, percentage };
    } catch {
      throw new InternalServerErrorException('Failed to fetch progress');
    }
  }

async updateClassSession(id: string, dto: UpdateClassSessionDto): Promise<ClassSessionDocument> {
  try {
    const session = await this.classSessionModel.findById(id);
    if (!session) throw new NotFoundException('Class session not found');

    const updateData = { ...dto };
    if (updateData.scheduledAt) {
      updateData.scheduledAt = new Date(`${updateData.scheduledAt}Z`) as any;
    }

    Object.assign(session, updateData); // ✅ updateData use karo
    return await session.save();
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Failed to update class session');
  }
}
  async deleteClassSession(id: string): Promise<void> {
    try {
      const session = await this.classSessionModel.findById(id);
      if (!session) throw new NotFoundException('Class session not found');
      await session.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete class session');
    }
  }

  private async getEnrolledCourseObjectIds(studentId: string): Promise<Types.ObjectId[]> {
    const enrollments = await this.enrollmentModel.find({ studentId, isActive: true });
    return enrollments.map((e) => new Types.ObjectId(e.courseId.toString()));
  }

  private async getAttendedSessionIds(studentId: string): Promise<Set<string>> {
    const attendances = await this.classAttendanceModel.find({ studentId });
    return new Set(attendances.map((a) => a.classSessionId.toString()));
  }
}