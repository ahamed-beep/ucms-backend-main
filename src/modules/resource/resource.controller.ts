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
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceResponseDto } from './dto/resource-response.dto';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';

@SerializeResponse(ResourceResponseDto)
@Controller('modules/:moduleId/resources')
export class ResourcesController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async createResource(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateResourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resourceService.createResource(
      moduleId,
      dto,
      file.buffer,
      file.originalname,
    );
  }

  @Get()
  async getResourcesByModule(@Param('moduleId') moduleId: string) {
    return this.resourceService.getResourcesByModule(moduleId);
  }

  @Get(':id')
  async getResourceById(@Param('id') id: string) {
    return this.resourceService.getResourceById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  async updateResource(
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.resourceService.updateResource(
      id,
      dto,
      file?.buffer,
      file?.originalname,
    );
  }

  @Delete(':id')
  async deleteResource(@Param('id') id: string) {
    return this.resourceService.deleteResource(id);
  }
}