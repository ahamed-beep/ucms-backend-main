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
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServicePageService } from './service-page.service';
import { CreateServicePageDto } from './dto/create-service-page.dto';
import { UpdateServicePageDto } from './dto/update-service-page.dto';
import { imageFilePipe, multerMemoryOptions } from '../cloudinary/multer.config';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { ServicePageResponseDto } from './dto/service-page-response.dto';
import { ServicePageDocument } from './entities/service-page.entity';
import {
  IServicePageResponse,
  IDeleteResponse,
} from './interfaces/service-page.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

@Controller('service-pages')
export class ServicePageController {
  constructor(private readonly servicePageService: ServicePageService) {}

  @Post()
    @RequireRole('admin')
  @UseGuards(RolesGuard, ActiveGuard)
  @UseInterceptors(FileInterceptor('icon', multerMemoryOptions))
  @SerializeResponse(ServicePageResponseDto)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile(imageFilePipe(true)) icon: Express.Multer.File,
    @Body() dto: CreateServicePageDto,
  ): Promise<IServicePageResponse> {
    try {
      const page: ServicePageDocument = await this.servicePageService.create(dto, icon);
      return { success: true, data: page };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create service page');
    }
  }

  @Get('admin')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(ServicePageResponseDto)
  async findAllAdmin(): Promise<IServicePageResponse> {
    try {
      const pages: ServicePageDocument[] = await this.servicePageService.findAllAdmin();
      return { success: true, data: pages };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch service pages');
    }
  }

  @Public()
  @Get()
  @SerializeResponse(ServicePageResponseDto)
  async findAll(): Promise<IServicePageResponse> {
    try {
      const pages: ServicePageDocument[] = await this.servicePageService.findAll();
      return { success: true, data: pages };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch service pages');
    }
  }

  @Public()
  @Get(':slug')
  @SerializeResponse(ServicePageResponseDto)
  async findOne(@Param('slug') slug: string): Promise<IServicePageResponse> {
    try {
      const page: ServicePageDocument = await this.servicePageService.findBySlug(slug);
      return { success: true, data: page };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch service page');
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('icon', multerMemoryOptions))
  @SerializeResponse(ServicePageResponseDto)
  async update(
    @Param('id') id: string,
    @UploadedFile(imageFilePipe(false)) icon: Express.Multer.File,
    @Body() dto: UpdateServicePageDto,
  ): Promise<IServicePageResponse> {
    try {
      const page: ServicePageDocument = await this.servicePageService.update(id, dto, icon);
      return { success: true, data: page };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to update service page');
    }
  }

  @Patch(':id/toggle')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(ServicePageResponseDto)
  async toggleActive(@Param('id') id: string): Promise<IServicePageResponse> {
    try {
      const page: ServicePageDocument = await this.servicePageService.toggleActive(id);
      return { success: true, data: page };
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to toggle service page');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async remove(@Param('id') id: string): Promise<IDeleteResponse> {
    try {
      return await this.servicePageService.remove(id);
    } catch (error) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to delete service page');
    }
  }
}