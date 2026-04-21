import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { BlogResponseDto } from './dto/blog-response.dto';
import { BlogListResponseDto } from './dto/blog-list-response.dto';
import { multerMemoryOptions, imageFilePipe } from '../cloudinary/multer.config';
import { BlogStatus } from './enums/blog.enum';
import { IsEnum } from 'class-validator';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

class UpdateStatusDto {
  @IsEnum(BlogStatus)
  status: BlogStatus;
}

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
      @UseGuards(RolesGuard, ActiveGuard)
        @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerMemoryOptions))
  @SerializeResponse(BlogResponseDto)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateBlogDto,
    @UploadedFile(imageFilePipe(true)) image: Express.Multer.File,
  ): Promise<BlogResponseDto> {
    return this.blogService.create(dto, image.buffer) as any;
  }

  @Get()
  @Public()
  @SerializeResponse(BlogListResponseDto, BlogResponseDto)
  async findAll(@Query() filterDto: BlogFilterDto): Promise<BlogListResponseDto> {
    return this.blogService.findAll(filterDto) as any;
  }

  @Get('published')
    @Public()
  @SerializeResponse(BlogListResponseDto, BlogResponseDto)
  async findPublished(@Query() filterDto: BlogFilterDto): Promise<BlogListResponseDto> {
    return this.blogService.findPublished(filterDto) as any;
  }

  @Get('featured')
    @Public()
  @SerializeResponse(BlogResponseDto)
  async findFeatured(): Promise<BlogResponseDto> {
    return this.blogService.findFeatured() as any;
  }

  @Get(':id')
    @Public()
  @SerializeResponse(BlogResponseDto)
  async findOne(@Param('id') id: string): Promise<BlogResponseDto> {
    return this.blogService.findOne(id) as any;
  }

  @Patch(':id')
      @UseGuards(RolesGuard, ActiveGuard)
        @RequireRole('admin')
  @UseInterceptors(FileInterceptor('image', multerMemoryOptions))
  @SerializeResponse(BlogResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @UploadedFile(imageFilePipe(false)) image?: Express.Multer.File,
  ): Promise<BlogResponseDto> {
    return this.blogService.update(id, dto, image?.buffer) as any;
  }

  @Delete(':id')
      @UseGuards(RolesGuard, ActiveGuard)
        @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.blogService.remove(id);
  }

  @Patch(':id/featured')
      @UseGuards(RolesGuard, ActiveGuard)
        @RequireRole('admin')
  @SerializeResponse(BlogResponseDto)
  async toggleFeatured(@Param('id') id: string): Promise<BlogResponseDto> {
    return this.blogService.toggleFeatured(id) as any;
  }

  @Patch(':id/status')
      @UseGuards(RolesGuard, ActiveGuard)
        @RequireRole('admin')
  @SerializeResponse(BlogResponseDto)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ): Promise<BlogResponseDto> {
    return this.blogService.updateStatus(id, dto.status) as any;
  }
}