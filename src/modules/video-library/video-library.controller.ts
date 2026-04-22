import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { VideoLibraryService } from './video-library.service';
import { CreateVideoLibraryDto } from './dto/create-video-library.dto';
import { UpdateVideoLibraryDto } from './dto/update-video-library.dto';
import { ToggleVideoStatusDto } from './dto/toggle-video-status.dto';
import { VideoLibraryQueryDto } from './dto/video-library-query.dto';
import { VideoLibraryResponseDto } from './dto/video-library-response.dto';
import { PaginatedVideoLibraryResponseDto } from './dto/paginated-video-library-response.dto';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { RequireRole } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ActiveGuard } from '../../common/guards/active.guard';

function isHttpException(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error;
}

@Controller('video-library')
export class VideoLibraryController {
  constructor(private readonly videoLibraryService: VideoLibraryService) {}

  @Post()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @SerializeResponse(VideoLibraryResponseDto)
  async create(
    @Body() dto: CreateVideoLibraryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.videoLibraryService.create(dto, file);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to create video');
    }
  }

  @Get('admin')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(PaginatedVideoLibraryResponseDto, VideoLibraryResponseDto)
  async findAllAdmin(@Query() query: VideoLibraryQueryDto) {
    try {
      return await this.videoLibraryService.findAll(query);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to fetch videos');
    }
  }

  @Get()
  @Public()
  @SerializeResponse(PaginatedVideoLibraryResponseDto, VideoLibraryResponseDto)
  async findAll(@Query() query: VideoLibraryQueryDto) {
    try {
      return await this.videoLibraryService.findAllActive(query);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to fetch videos');
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(VideoLibraryResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.videoLibraryService.findOne(id);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to fetch video');
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @SerializeResponse(VideoLibraryResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVideoLibraryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.videoLibraryService.update(id, dto, file);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to update video');
    }
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(VideoLibraryResponseDto)
  async toggleStatus(@Param('id') id: string, @Body() dto: ToggleVideoStatusDto) {
    try {
      return await this.videoLibraryService.toggleStatus(id, dto);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to update video status');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      return await this.videoLibraryService.remove(id);
    } catch (error) {
      if (isHttpException(error)) throw error;
      throw new InternalServerErrorException('Failed to delete video');
    }
  }
}