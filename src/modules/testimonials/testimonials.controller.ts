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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryOptions, imageFilePipe } from '../cloudinary/multer.config';
import { TestimonialsService } from './testimonials.service';
import { ResponseTestimonialDto } from './dto/response-testimonial.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
     @UseGuards(RolesGuard, ActiveGuard)
      @RequireRole('admin')
  @SerializeResponse(ResponseTestimonialDto)
  @UseInterceptors(FileInterceptor('flag', multerMemoryOptions))
  async create(
    @Body() dto: CreateTestimonialDto,
    @UploadedFile(imageFilePipe(false)) flagFile?: Express.Multer.File,
  ) {
    try {
      return await this.testimonialsService.create(dto, flagFile);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create testimonial');
    }
  }

  @Get()
  @Public()
  @SerializeResponse(ResponseTestimonialDto)
  async findAll() {
    try {
      return await this.testimonialsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch testimonials');
    }
  }

  @Get(':id')
    @Public()
  @SerializeResponse(ResponseTestimonialDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.testimonialsService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
    @UseGuards(RolesGuard, ActiveGuard)
      @RequireRole('admin')
  @SerializeResponse(ResponseTestimonialDto)
  @UseInterceptors(FileInterceptor('flag', multerMemoryOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
    @UploadedFile(imageFilePipe(false)) flagFile?: Express.Multer.File,
  ) {
    try {
      return await this.testimonialsService.update(id, dto, flagFile);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
    @UseGuards(RolesGuard, ActiveGuard)
      @RequireRole('admin')
  async remove(@Param('id') id: string) {
    try {
      return await this.testimonialsService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}