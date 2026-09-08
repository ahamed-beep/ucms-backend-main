import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { CareerResourceService } from './career-resource.service';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { CareerResourceResponseDto } from './dto/career-resource-response.dto';
import { CreateCareerResourceDto } from './dto/create-career-resource.dto';
import { PaginatedCareerResourceResponseDto } from './dto/paginated-career-resource-response.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CareerResourceQueryDto } from './dto/career-resource-query.dto';
import { UpdateCareerResourceDto } from './dto/update-career-resource.dto';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function validateDocumentFile(file: Express.Multer.File | undefined, required: boolean): void {
  if (!file) {
    if (required) throw new BadRequestException('File is required');
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestException('File size must not exceed 20MB');
  }

  const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (!mimeOk && !extOk) {
    throw new BadRequestException('Only PDF and DOC/DOCX files are allowed');
  }
}

@Controller('career-resources')
export class CareerResourceController {
  constructor(private readonly careerResourceService: CareerResourceService) {}

  @Post()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  @SerializeResponse(CareerResourceResponseDto)
  async create(
    @Body() dto: CreateCareerResourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      validateDocumentFile(file, true);
      return await this.careerResourceService.create(dto, file);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create Career resource');
    }
  }

  @Get()
  @Public()
  @SerializeResponse(PaginatedCareerResourceResponseDto, CareerResourceResponseDto)
  async findAll(@Query() query: CareerResourceQueryDto) {
    try {
      return await this.careerResourceService.findAll(query);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch Career resources');
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(CareerResourceResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.careerResourceService.findOne(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch Career resource');
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  @SerializeResponse(CareerResourceResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCareerResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      validateDocumentFile(file, false);
      return await this.careerResourceService.update(id, dto, file);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to update Career resource');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.careerResourceService.remove(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to delete Career resource');
    }
  }

  @Post(':id/download')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackDownload(@Param('id') id: string) {
    try {
      await this.careerResourceService.incrementDownload(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to track download');
    }
  }
}