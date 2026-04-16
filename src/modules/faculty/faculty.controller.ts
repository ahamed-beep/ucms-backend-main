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
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { CreateFacultyApplicationDto } from './dto/create-faculty-application.dto';
import { Public } from '../../common/decorators/public.decorator';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { FacultyApplicationService } from './faculty.service';
import { UpdateFacultyStatusDto } from './dto/update-faculty-status.dto';

@Controller('faculty-applications')
export class FacultyApplicationController {
  constructor(private readonly facultyApplicationService: FacultyApplicationService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('cv', { 
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  }))
  async create(
    @Body() dto: CreateFacultyApplicationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const application = await this.facultyApplicationService.create(dto, file);
    return { success: true, data: application };
  }

  @RequireRole('admin')
  @Get()
  async findAll() {
    const data = await this.facultyApplicationService.findAll();
    return { success: true, data: { data } };
  }

  @RequireRole('admin')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFacultyStatusDto,
  ) {
    const data = await this.facultyApplicationService.updateStatus(id, dto);
    return { success: true, data };
  }

  @RequireRole('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.facultyApplicationService.remove(id);
    return { success: true };
  }

  @RequireRole('admin')
  @Get(':id/download-cv')
  @HttpCode(HttpStatus.OK)
  async downloadCv(@Param('id') id: string, @Res() res: Response) {
    await this.facultyApplicationService.downloadCv(id, res);
  }
}