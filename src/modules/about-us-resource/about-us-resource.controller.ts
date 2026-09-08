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
import { AboutUsResourceService } from './about-us-resource.service';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { AboutUsResourceResponseDto } from '../about-us-resource/dto/about-us-resource-response.dto';
import { CreateAboutUsResourceDto } from './dto/create-about-us-resource.dto';
import { PaginatedAboutUsResourceResponseDto } from '../about-us-resource/dto/paginated-about-us-resource-response.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { AboutUsResourceQueryDto } from './dto/about-us-resource-query.dto';
import { UpdateAboutUsResourceDto } from './dto/update-about-us-resource.dto';

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

@Controller('about-us-resources')
export class AboutUsResourceController {
  constructor(private readonly aboutUsResourceService: AboutUsResourceService) {}

  @Post()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  @SerializeResponse(AboutUsResourceResponseDto)
  async create(
    @Body() dto: CreateAboutUsResourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      validateDocumentFile(file, true);
      return await this.aboutUsResourceService.create(dto, file);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create About Us resource');
    }
  }

  @Get()
  @Public()
  @SerializeResponse(PaginatedAboutUsResourceResponseDto, AboutUsResourceResponseDto)
  async findAll(@Query() query: AboutUsResourceQueryDto) {
    try {
      return await this.aboutUsResourceService.findAll(query);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch About Us resources');
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(AboutUsResourceResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.aboutUsResourceService.findOne(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch About Us resource');
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  @SerializeResponse(AboutUsResourceResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAboutUsResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      validateDocumentFile(file, false);
      return await this.aboutUsResourceService.update(id, dto, file);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to update About Us resource');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.aboutUsResourceService.remove(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to delete About Us resource');
    }
  }

  @Post(':id/download')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackDownload(@Param('id') id: string) {
    try {
      await this.aboutUsResourceService.incrementDownload(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to track download');
    }
  }
}