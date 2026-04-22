import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { RequireRole } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { QuizAdminDetailResponseDto } from './dto/quiz-admin-detail-response.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { PaginatedQuizzesResponseDto } from './dto/paginated-quizzes-response.dto';
import { QuizListItemResponseDto } from './dto/quiz-listItem-response.dto';
import { QuizQueryDto } from './dto/quiz-query.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ToggleQuizStatusDto } from './dto/toggle-quiz-status.dto';
import { QuizDetailResponseDto } from './dto/quiz-detail-response.dto';
import { QuizResultResponseDto } from './dto/quiz-result-response.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';

function isHttpException(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error;
}

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(QuizAdminDetailResponseDto)
  async create(@Body() dto: CreateQuizDto) {
    try {
      return await this.quizService.create(dto);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to create quiz');
    }
  }

  @Get('admin')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(PaginatedQuizzesResponseDto, QuizListItemResponseDto)
  async findAllAdmin(@Query() query: QuizQueryDto) {
    try {
      return await this.quizService.findAll(query);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

  @Get('admin/:id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(QuizAdminDetailResponseDto)
  async findOneAdmin(@Param('id') id: string) {
    try {
      return await this.quizService.findOne(id);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to fetch quiz');
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(QuizAdminDetailResponseDto)
  async update(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    try {
      return await this.quizService.update(id, dto);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to update quiz');
    }
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(QuizAdminDetailResponseDto)
  async toggleStatus(@Param('id') id: string, @Body() dto: ToggleQuizStatusDto) {
    try {
      return await this.quizService.toggleStatus(id, dto);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to update quiz status');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      return await this.quizService.remove(id);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to delete quiz');
    }
  }

  @Get()
  @Public()
  @SerializeResponse(PaginatedQuizzesResponseDto, QuizListItemResponseDto)
  async findAll(@Query() query: QuizQueryDto) {
    try {
      return await this.quizService.findAllActive(query);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(QuizDetailResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.quizService.findOneActive(id);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to fetch quiz');
    }
  }

  @Post(':id/submit')
  @Public()
  @SerializeResponse(QuizResultResponseDto)
  async submit(@Param('id') id: string, @Body() dto: SubmitQuizDto) {
    try {
      return await this.quizService.submitQuiz(id, dto);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to submit quiz');
    }
  }
}