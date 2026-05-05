import {
  Controller,
  Get,
  UseGuards,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { StudentProgressService } from './student-progress.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@UseGuards(RolesGuard, ActiveGuard)
@RequireRole('student')
@Controller('student/progress')
export class StudentProgressController {
  constructor(private readonly studentProgressService: StudentProgressService) {}

  @Get()
  async getMyProgress(@CurrentUser() user: any) {
    try {
      return await this.studentProgressService.getStudentProgress(user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch progress');
    }
  }
}