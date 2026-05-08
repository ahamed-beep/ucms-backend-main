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
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/common/interfaces/jwt-payload.interface';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@SerializeResponse(ApplicationResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

@Post()
@RequireRole('admin')
async createApplication(@Body() dto: CreateApplicationDto) {
  try {
    return await this.applicationService.createApplication(dto);
  } catch (error) {
    rethrowIfHttp(error);
    throw new InternalServerErrorException('Failed to create application');
  }
}
  @Get()
  @RequireRole('admin')
  async getAllApplications() {
    try {
      return await this.applicationService.getAllApplications();
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch applications');
    }
  }

 @Get('my-applications')
@RequireRole('student')
async getMyApplications(@CurrentUser() user: RequestUser) {
  try {
    return await this.applicationService.getMyApplications(user.userId);
  } catch (error) {
    rethrowIfHttp(error);
    throw new InternalServerErrorException('Failed to fetch applications');
  }
}

  @Get(':id')
  @RequireRole('admin', 'student')
  async getApplicationById(@Param('id') id: string) {
    try {
      return await this.applicationService.getApplicationById(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch application');
    }
  }

  @Patch(':id')
  @RequireRole('admin')
  async updateApplication(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    try {
      return await this.applicationService.updateApplication(id, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update application');
    }
  }

  @Patch(':id/status')
  @RequireRole('admin')
  async updateApplicationStatus(@Param('id') id: string, @Body() dto: UpdateApplicationStatusDto) {
    try {
      return await this.applicationService.updateApplicationStatus(id, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update application status');
    }
  }

  @Delete(':id')
  @RequireRole('admin')
  async deleteApplication(@Param('id') id: string) {
    try {
      return await this.applicationService.deleteApplication(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete application');
    }
  }
}