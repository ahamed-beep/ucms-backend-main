import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LectureQuiz, LectureQuizDocument } from './entities/lecture-quiz.entity';
import { LectureQuizCompletion, LectureQuizCompletionDocument } from './entities/lecture-quiz-completion.entity';
import { Quiz, QuizDocument } from '../quiz/entities/quiz.entity';
import { Lecture, LectureDocument } from '../lecture/entities/lecture.entity';
import { CourseModule, CourseModuleDocument } from '../course-module/entities/course-module.entity';
import { LectureProgress, LectureProgressDocument } from '../lecture-progress/entities/lecture-progress.entity';
import { AttachQuizDto } from './dto/attach-quiz.dto';
import { SubmitLectureQuizDto } from './dto/submit-lecture-quiz.dto';
import { QuizStatus } from '../quiz/enums/quiz.enum';

@Injectable()
export class LectureQuizService {
  constructor(
    @InjectModel(LectureQuiz.name)
    private readonly lectureQuizModel: Model<LectureQuizDocument>,
    @InjectModel(LectureQuizCompletion.name)
    private readonly completionModel: Model<LectureQuizCompletionDocument>,
    @InjectModel(Quiz.name)
    private readonly quizModel: Model<QuizDocument>,
    @InjectModel(Lecture.name)
    private readonly lectureModel: Model<LectureDocument>,
    @InjectModel(CourseModule.name)
    private readonly courseModuleModel: Model<CourseModuleDocument>,
    @InjectModel(LectureProgress.name)
    private readonly lectureProgressModel: Model<LectureProgressDocument>,
  ) {}

  async attachQuiz(lectureId: string, dto: AttachQuizDto): Promise<any> {
    try {
      const quiz = await this.quizModel.findOne({
        _id: new Types.ObjectId(dto.quizId),
        status: QuizStatus.ACTIVE,
      });
      if (!quiz) throw new NotFoundException('Quiz not found or inactive');

      const existing = await this.lectureQuizModel.findOne({
        lectureId: new Types.ObjectId(lectureId),
        quizId: new Types.ObjectId(dto.quizId),
      });
      if (existing) throw new ConflictException('Quiz already attached to this lecture');

      const saved = await this.lectureQuizModel.create({
        lectureId: new Types.ObjectId(lectureId),
        quizId: new Types.ObjectId(dto.quizId),
        order: dto.order ?? 0,
      });

      return {
        id: (saved._id as Types.ObjectId).toString(),
        quizId: dto.quizId,
        lectureId,
        order: saved.order,
        isCompleted: false,
        scorePercent: null,
        createdAt: (saved as any).createdAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to attach quiz');
    }
  }

  async detachQuiz(lectureId: string, quizId: string): Promise<void> {
    try {
      const result = await this.lectureQuizModel.findOneAndDelete({
        lectureId: new Types.ObjectId(lectureId),
        quizId: new Types.ObjectId(quizId),
      });
      if (!result) throw new NotFoundException('Attached quiz not found');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to detach quiz');
    }
  }

  async getQuizzesForLecture(lectureId: string, userId: string): Promise<any[]> {
    try {
      const lectureQuizzes = await this.lectureQuizModel
        .find({ lectureId: new Types.ObjectId(lectureId) })
        .populate('quizId')
        .sort({ order: 1 });

      const completions = await this.completionModel.find({
        lectureQuizId: { $in: lectureQuizzes.map((lq) => lq._id) },
        userId: new Types.ObjectId(userId),
      });

      const completionMap = new Map(
        completions.map((c) => [c.lectureQuizId.toString(), c]),
      );

      return lectureQuizzes.map((lq) => {
        const completion = completionMap.get((lq._id as Types.ObjectId).toString());
        return {
          id: (lq._id as Types.ObjectId).toString(),
          quizId: (lq.quizId as any)?._id?.toString() ?? lq.quizId.toString(),
          lectureId: lq.lectureId.toString(),
          order: lq.order,
          isCompleted: !!completion,
          scorePercent: completion?.scorePercent ?? null,
          createdAt: (lq as any).createdAt,
        };
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch lecture quizzes');
    }
  }

  async getQuizzesForLectureAdmin(lectureId: string): Promise<any[]> {
    try {
      const lectureQuizzes = await this.lectureQuizModel
        .find({ lectureId: new Types.ObjectId(lectureId) })
        .populate('quizId')
        .sort({ order: 1 });

      return lectureQuizzes.map((lq) => ({
        id: (lq._id as Types.ObjectId).toString(),
        quizId: (lq.quizId as any)?._id?.toString() ?? lq.quizId.toString(),
        lectureId: lq.lectureId.toString(),
        order: lq.order,
        isCompleted: false,
        scorePercent: null,
        createdAt: (lq as any).createdAt,
      }));
    } catch {
      throw new InternalServerErrorException('Failed to fetch lecture quizzes');
    }
  }

  async submitLectureQuiz(
    lectureId: string,
    quizId: string,
    userId: string,
    dto: SubmitLectureQuizDto,
  ): Promise<any> {
    try {
      const lectureQuiz = await this.lectureQuizModel.findOne({
        lectureId: new Types.ObjectId(lectureId),
        quizId: new Types.ObjectId(quizId),
      });
      if (!lectureQuiz) throw new NotFoundException('Quiz not attached to this lecture');

      const alreadyDone = await this.completionModel.findOne({
        lectureQuizId: lectureQuiz._id as Types.ObjectId,
        userId: new Types.ObjectId(userId),
      });
      if (alreadyDone) throw new BadRequestException('Quiz already completed');

      const quiz = await this.quizModel.findOne({
        _id: new Types.ObjectId(quizId),
        status: QuizStatus.ACTIVE,
      });
      if (!quiz) throw new NotFoundException('Quiz not found or inactive');

      const questions = quiz.questions;

      if (dto.answers.length !== questions.length) {
        throw new BadRequestException('Answers count does not match questions count');
      }

      let correctCount = 0;
      for (let i = 0; i < questions.length; i++) {
        if (dto.answers[i] !== null && dto.answers[i] === questions[i].correctAnswerIndex) {
          correctCount++;
        }
      }

      const totalQuestions = questions.length;
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);
      const timeTakenSeconds = dto.timeTakenSeconds ?? 0;

      await this.completionModel.create({
        lectureQuizId: lectureQuiz._id,
        userId: new Types.ObjectId(userId),
        scorePercent,
        timeTakenSeconds,
      });

      await this.quizModel.findByIdAndUpdate(quizId, { $inc: { attempts: 1 } });

      console.log('=== PROGRESS DEBUG ===');
      console.log('lectureId:', lectureId);
      console.log('userId:', userId);

      const lectureDoc = await this.lectureModel.findById(lectureId).lean();
      console.log('lectureDoc found:', lectureDoc ? 'YES' : 'NO', lectureDoc);

      if (lectureDoc) {
        const moduleDoc = await this.courseModuleModel
          .findById(lectureDoc.courseModuleId)
          .lean();
        console.log('moduleDoc found:', moduleDoc ? 'YES' : 'NO', moduleDoc);

     if (moduleDoc) {
  await this.lectureProgressModel.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      lectureId: new Types.ObjectId(lectureId),
    },
    {
      userId: new Types.ObjectId(userId),
      lectureId: new Types.ObjectId(lectureId),
      courseId: new Types.ObjectId(moduleDoc.courseId.toString()),
      completed: true,
    },
    { upsert: true, new: true },
  );
}
      }

      console.log('=== END DEBUG ===');

      return {
        quizId,
        totalQuestions,
        correctCount,
        incorrectCount: totalQuestions - correctCount,
        scorePercent,
        timeTakenSeconds,
        isCompleted: true,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to submit quiz');
    }
  }
}