import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClassSessionService } from './class-session.service';
import { CreateClassSessionDto } from './dto/create-class-session.dto';
import { UpdateClassSessionDto } from './dto/update-class-session.dto';
import { ClassSessionResponseDto } from './dto/class-session-response.dto';
import { JoinClassResponseDto } from './dto/join-class-response.dto';
import { StudentProgressResponseDto } from './dto/student-progress-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@UseGuards(RolesGuard, ActiveGuard)
@Controller('class-sessions')
export class ClassSessionController {
  constructor(private readonly classSessionService: ClassSessionService) {}

  // ─── No param routes first ───────────────────────────────────────────

  @Post()
  @RequireRole('admin')
  @SerializeResponse(ClassSessionResponseDto)
  async createClassSession(@Body() dto: CreateClassSessionDto) {
    try {
      return await this.classSessionService.createClassSession(dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create class session');
    }
  }

  @Get()
  @RequireRole('admin', 'student')
  async getAllSessions(@Request() req: any) {
    try {
      if (req.user?.role === 'admin') {
        return await this.classSessionService.getAllSessions();
      }
      return await this.classSessionService.getMySchedule(req.user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch sessions');
    }
  }

  @Get('my-schedule')
  @RequireRole('student')
  async getMySchedule(@Request() req: any) {
    try {
      return await this.classSessionService.getMySchedule(req.user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch schedule');
    }
  }

  @Get('weekly')
  @RequireRole('student')
  async getWeeklySchedule(@Request() req: any) {
    try {
      return await this.classSessionService.getWeeklySchedule(req.user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch weekly schedule');
    }
  }

  @Get('my-progress')
  @RequireRole('student')
  @SerializeResponse(StudentProgressResponseDto)
  async getMyProgress(@Request() req: any) {
    try {
      return await this.classSessionService.getMyProgress(req.user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch progress');
    }
  }

  // ─── Param routes last ───────────────────────────────────────────────

  @Get(':id')
  @RequireRole('admin', 'student')
  @SerializeResponse(ClassSessionResponseDto)
  async getClassSessionById(@Param('id') id: string, @Request() req: any) {
    try {
      const studentId = req.user?.role === 'student' ? req.user.userId : undefined;
      return await this.classSessionService.getClassSessionById(id, studentId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch class session');
    }
  }

  @Post(':id/join')
  @RequireRole('student')
  @SerializeResponse(JoinClassResponseDto)
  async joinClass(@Param('id') id: string, @Request() req: any) {
    try {
      return await this.classSessionService.joinClass(id, req.user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to join class');
    }
  }

  @Patch(':id')
  @RequireRole('admin')
  @SerializeResponse(ClassSessionResponseDto)
  async updateClassSession(@Param('id') id: string, @Body() dto: UpdateClassSessionDto) {
    try {
      return await this.classSessionService.updateClassSession(id, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update class session');
    }
  }

  @Delete(':id')
  @RequireRole('admin')
  async deleteClassSession(@Param('id') id: string) {
    try {
      return await this.classSessionService.deleteClassSession(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete class session');
    }
  }
}