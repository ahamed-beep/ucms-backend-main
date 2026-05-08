import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/common/interfaces/jwt-payload.interface';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@UseGuards(RolesGuard, ActiveGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @RequireRole('student')
  async getStudentStats(@CurrentUser() user: RequestUser) {
    try {
      return await this.dashboardService.getStudentStats(user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch dashboard stats');
    }
  }
}