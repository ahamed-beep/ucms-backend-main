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
  InternalServerErrorException,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceResponseDto } from './dto/resource-response.dto';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@SerializeResponse(ResourceResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('modules/:moduleId/resources')
export class ResourcesController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
    @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async createResource(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateResourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.resourceService.createResource(
        moduleId,
        dto,
        file.buffer,
        file.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create resource');
    }
  }

  @Get()
    @RequireRole('admin', 'student')
  async getResourcesByModule(@Param('moduleId') moduleId: string) {
    try {
      return await this.resourceService.getResourcesByModule(moduleId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch resources');
    }
  }

  @Get(':id')
    @RequireRole('admin', 'student')
  async getResourceById(@Param('id') id: string) {
    try {
      return await this.resourceService.getResourceById(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch resource');
    }
  }

  @Patch(':id')
    @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async updateResource(
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.resourceService.updateResource(
        id,
        dto,
        file?.buffer,
        file?.originalname,
      );
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update resource');
    }
  }

  @Delete(':id')
    @RequireRole('admin')
  async deleteResource(@Param('id') id: string) {
    try {
      return await this.resourceService.deleteResource(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete resource');
    }
  }
}