import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../../common/decorators/public.decorator';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GalleryItemDto, GalleryResponseDto } from './dto/gallery-response.dto';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { imageFilePipe, multerMemoryOptions } from '../cloudinary/multer.config';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Public()
  @Get()
  @SerializeResponse(GalleryResponseDto, GalleryItemDto)
  findAll() {
    return this.galleryService.findAll();
  }

  @RequireRole('admin')
  @Get('admin/all')
  @SerializeResponse(GalleryResponseDto, GalleryItemDto)
  findAllAdmin() {
    return this.galleryService.findAllAdmin();
  }

  @Public()
  @Get(':id')
  @SerializeResponse(GalleryResponseDto, GalleryItemDto)
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @RequireRole('admin')
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, multerMemoryOptions))
  @SerializeResponse(GalleryResponseDto, GalleryItemDto)
  create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFiles(imageFilePipe(true)) files: Express.Multer.File[],
  ) {
    return this.galleryService.create(createGalleryDto, files);
  }

  @RequireRole('admin')
  @Patch(':id')
  @SerializeResponse(GalleryResponseDto, GalleryItemDto)
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(id, updateGalleryDto);
  }

  @RequireRole('admin')
  @Patch(':id/toggle-status')
  @SerializeResponse(GalleryResponseDto, GalleryItemDto)
  toggleStatus(@Param('id') id: string) {
    return this.galleryService.toggleStatus(id);
  }

  @RequireRole('admin')
  @Patch(':id/add-images')
  @UseInterceptors(FilesInterceptor('images', 10, multerMemoryOptions))
  @SerializeResponse(GalleryResponseDto, GalleryItemDto)
  addImages(
    @Param('id') id: string,
    @UploadedFiles(imageFilePipe(true)) files: Express.Multer.File[],
  ) {
    return this.galleryService.addImages(id, files);
  }

  @RequireRole('admin')
  @Delete(':id/image/:publicId')
  @SerializeResponse(GalleryResponseDto, GalleryItemDto)
  removeImage(
    @Param('id') id: string,
    @Param('publicId') publicId: string,
  ) {
    return this.galleryService.removeImage(id, publicId);
  }

  @RequireRole('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}