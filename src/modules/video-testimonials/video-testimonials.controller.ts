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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { VideoTestimonialsService } from './video-testimonials.service';

import { ResponseVideoTestimonialDto } from './dto/response-video-testimonial.dto';
import { CreateVideoTestimonialDto } from './dto/create-video-testimonial.dto';
import { UpdateVideoTestimonialDto } from './dto/update-video-testimonial.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

const videoFilePipe = (required: boolean) =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }),
      new FileTypeValidator({ fileType: /video\/(mp4|webm|mov|avi)/ }),
    ],
    fileIsRequired: required,
  });

@Controller('video-testimonials')
export class VideoTestimonialsController {
  constructor(
    private readonly videoTestimonialsService: VideoTestimonialsService,
  ) {}

  @Post()
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @SerializeResponse(ResponseVideoTestimonialDto)
  @UseInterceptors(FileInterceptor('video', multerMemoryOptions))
  async create(
    @Body() dto: CreateVideoTestimonialDto,
    @UploadedFile(videoFilePipe(true)) videoFile: Express.Multer.File,
  ) {
    try {
      return await this.videoTestimonialsService.create(dto, videoFile);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create video testimonial');
    }
  }

  @Get()
  @Public()
  @SerializeResponse(ResponseVideoTestimonialDto)
  async findAll() {
    try {
      return await this.videoTestimonialsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch video testimonials');
    }
  }

  @Get(':id')
    @Public()
  @SerializeResponse(ResponseVideoTestimonialDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.videoTestimonialsService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @SerializeResponse(ResponseVideoTestimonialDto)
  @UseInterceptors(FileInterceptor('video', multerMemoryOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVideoTestimonialDto,
    @UploadedFile(videoFilePipe(false)) videoFile?: Express.Multer.File,
  ) {
    try {
      return await this.videoTestimonialsService.update(id, dto, videoFile);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  async remove(@Param('id') id: string) {
    try {
      return await this.videoTestimonialsService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}