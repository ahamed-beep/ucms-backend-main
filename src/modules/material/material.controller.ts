import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialResponseDto } from './dto/material-response.dto';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { EnrollmentGuard } from 'src/common/guards/enrollment.guard';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@SerializeResponse(MaterialResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('courses/:courseId/materials')
export class MaterialsController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async createMaterial(
    @Param('courseId') courseId: string,
    @Body() dto: CreateMaterialDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.materialService.createMaterial(
        courseId,
        dto,
        file.buffer,
        file.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create material');
    }
  }

  @Get()
  @RequireRole('admin', 'student')
  @UseGuards(EnrollmentGuard)
  async getMaterialsByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.materialService.getMaterialsByCourse(courseId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch materials');
    }
  }

  @Get(':id')
  @UseGuards(EnrollmentGuard)
  @RequireRole('admin', 'student')
  async getMaterialById(@Param('id') id: string) {
    try {
      return await this.materialService.getMaterialById(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch material');
    }
  }

  @Patch(':id')
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async updateMaterial(
    @Param('id') id: string,
    @Body() dto: UpdateMaterialDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.materialService.updateMaterial(
        id,
        dto,
        file?.buffer,
        file?.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update material');
    }
  }

  @Delete(':id')
  @RequireRole('admin')
  async deleteMaterial(@Param('id') id: string) {
    try {
      return await this.materialService.deleteMaterial(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete material');
    }
  }
}