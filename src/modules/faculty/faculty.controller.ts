import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { CreateFacultyApplicationDto } from './dto/create-faculty-application.dto';
import { UpdateFacultyStatusDto } from './dto/update-faculty-status.dto';
import { FacultyApplicationResponseDto } from './dto/faculty-application-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { FacultyApplicationService } from './faculty.service';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';

@Controller('faculty-applications')
export class FacultyApplicationController {
  constructor(private readonly facultyApplicationService: FacultyApplicationService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SerializeResponse(FacultyApplicationResponseDto)
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() dto: CreateFacultyApplicationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const data = await this.facultyApplicationService.create(dto, file);
      return { success: true, data };
    } catch (error) {
      if ((error as any)?.status) throw error;
      throw new InternalServerErrorException('Failed to submit faculty application.');
    }
  }

  @RequireRole('admin')
  @Get()
  @SerializeResponse(FacultyApplicationResponseDto)
  async findAll() {
    try {
      const data = await this.facultyApplicationService.findAll();
      return { success: true, data };
    } catch (error) {
      if ((error as any)?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch faculty applications.');
    }
  }

  @RequireRole('admin')
  @Patch(':id/status')
  @SerializeResponse(FacultyApplicationResponseDto)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFacultyStatusDto,
  ) {
    try {
      const data = await this.facultyApplicationService.updateStatus(id, dto);
      return { success: true, data };
    } catch (error) {
      if ((error as any)?.status) throw error;
      throw new InternalServerErrorException('Failed to update application status.');
    }
  }

  @RequireRole('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.facultyApplicationService.remove(id);
    } catch (error) {
      if ((error as any)?.status) throw error;
      throw new InternalServerErrorException('Failed to delete faculty application.');
    }
  }

  @RequireRole('admin')
  @Get(':id/download-cv')
  async downloadCv(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.facultyApplicationService.downloadCv(id, res);
    } catch (error) {
      if ((error as any)?.status) throw error;
      throw new InternalServerErrorException('Failed to download CV.');
    }
  }
}