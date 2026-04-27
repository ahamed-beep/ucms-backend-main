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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialResponseDto } from './dto/material-response.dto';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';

@SerializeResponse(MaterialResponseDto)
@Controller('courses/:courseId/materials')
export class MaterialsController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async createMaterial(
    @Param('courseId') courseId: string,
    @Body() dto: CreateMaterialDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.materialService.createMaterial(
      courseId,
      dto,
      file.buffer,
      file.originalname,
    );
  }

  @Get()
  async getMaterialsByCourse(@Param('courseId') courseId: string) {
    return this.materialService.getMaterialsByCourse(courseId);
  }

  @Get(':id')
  async getMaterialById(@Param('id') id: string) {
    return this.materialService.getMaterialById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async updateMaterial(
    @Param('id') id: string,
    @Body() dto: UpdateMaterialDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.materialService.updateMaterial(
      id,
      dto,
      file?.buffer,
      file?.originalname,
    );
  }

  @Delete(':id')
  async deleteMaterial(@Param('id') id: string) {
    return this.materialService.deleteMaterial(id);
  }
}