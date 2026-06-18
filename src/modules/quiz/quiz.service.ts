import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './entities/quiz.entity';
import { QuizStatus, QuizType } from './enums/quiz.enum';
import { IQuizResult, IPaginatedQuizzes } from './interfaces/quiz.interface';
import { ToggleQuizStatusDto } from './dto/toggle-quiz-status.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizQueryDto } from './dto/quiz-query.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) {}

  async create(dto: CreateQuizDto): Promise<QuizDocument> {
    try {
      const quiz = new this.quizModel(dto);
      return await quiz.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create quiz');
    }
  }

  async findAll(query: QuizQueryDto): Promise<IPaginatedQuizzes> {
    try {
      const { status, category, difficulty, quizType, page = 1, limit = 10 } = query;
      const filter: Record<string, any> = {};

      if (status) filter.status = status;
      if (category) filter.category = category;
      if (difficulty) filter.difficulty = difficulty;
      if (quizType) filter.quizType = quizType;

      const skip = (page - 1) * limit;
      const [docs, total] = await Promise.all([
        this.quizModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        this.quizModel.countDocuments(filter),
      ]);

      return {
        data: docs.map((d) => d.toObject({ virtuals: true })) as any,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

  // Public home page — sirf standalone active quizzes
  async findAllActive(query: QuizQueryDto): Promise<IPaginatedQuizzes> {
    return this.findAll({
      ...query,
      status: QuizStatus.ACTIVE,
      quizType: QuizType.STANDALONE,
    });
  }

  async findOne(id: string): Promise<QuizDocument> {
    try {
      const quiz = await this.quizModel.findById(id);
      if (!quiz) throw new NotFoundException('Quiz not found');
      return quiz;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch quiz');
    }
  }

  async findOneActive(id: string): Promise<QuizDocument> {
    try {
      const quiz = await this.quizModel.findOne({ _id: id, status: QuizStatus.ACTIVE });
      if (!quiz) throw new NotFoundException('Quiz not found or inactive');
      return quiz;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch quiz');
    }
  }

  async update(id: string, dto: UpdateQuizDto): Promise<QuizDocument> {
    try {
      const quiz = await this.quizModel.findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      });
      if (!quiz) throw new NotFoundException('Quiz not found');
      return quiz;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update quiz');
    }
  }

  async toggleStatus(id: string, dto: ToggleQuizStatusDto): Promise<QuizDocument> {
    try {
      const quiz = await this.quizModel.findByIdAndUpdate(
        id,
        { status: dto.status },
        { new: true },
      );
      if (!quiz) throw new NotFoundException('Quiz not found');
      return quiz;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update quiz status');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.quizModel.findByIdAndDelete(id);
      if (!result) throw new NotFoundException('Quiz not found');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete quiz');
    }
  }

  async submitQuiz(id: string, dto: SubmitQuizDto): Promise<IQuizResult> {
    try {
      const quiz = await this.findOneActive(id);
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
      const incorrectCount = totalQuestions - correctCount;
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);

      await this.quizModel.findByIdAndUpdate(id, { $inc: { attempts: 1 } });

      return {
        quizId: id,
        totalQuestions,
        correctCount,
        incorrectCount,
        scorePercent,
        timeTakenSeconds: dto.timeTakenSeconds,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to submit quiz');
    }
  }
}