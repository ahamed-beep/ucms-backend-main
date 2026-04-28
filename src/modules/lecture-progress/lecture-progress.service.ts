import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LectureProgress, LectureProgressDocument } from './entities/lecture-progress.entity';

@Injectable()
export class LectureProgressService {
  constructor(
    @InjectModel(LectureProgress.name)
    private readonly progressModel: Model<LectureProgressDocument>,
  ) {}

  async markCompleted(userId: string, lectureId: string, courseId: string): Promise<LectureProgressDocument> {
    try {
      return await this.progressModel.findOneAndUpdate(
        { userId: new Types.ObjectId(userId), lectureId: new Types.ObjectId(lectureId) },
        { userId: new Types.ObjectId(userId), lectureId: new Types.ObjectId(lectureId), courseId: new Types.ObjectId(courseId), completed: true },
        { upsert: true, new: true },
      );
    } catch {
      throw new InternalServerErrorException('Failed to mark lecture as completed');
    }
  }

  async getCompletedLectureIds(userId: string, courseId: string): Promise<string[]> {
    try {
      const records = await this.progressModel.find({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        completed: true,
      });
      return records.map((r) => r.lectureId.toString());
    } catch {
      throw new InternalServerErrorException('Failed to fetch progress');
    }
  }
}