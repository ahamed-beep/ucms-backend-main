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
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryOptions, imageFilePipe } from '../cloudinary/multer.config';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { DestinationResponseDto } from './dto/destination-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('destinations')
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @Post()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(DestinationResponseDto)
  @UseInterceptors(FileInterceptor('flag', multerMemoryOptions))
  async create(
    @Body() dto: CreateDestinationDto,
    @UploadedFile(imageFilePipe(true)) file: Express.Multer.File,
  ) {
    try {
      return await this.destinationService.create(dto, file);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Public()
  @SerializeResponse(DestinationResponseDto)
  async findAll() {
    try {
      return await this.destinationService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get('admin/all')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(DestinationResponseDto)
  async findAllAdmin() {
    try {
      return await this.destinationService.findAllAdmin();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(DestinationResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.destinationService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/toggle-status')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(DestinationResponseDto)
  async toggleStatus(@Param('id') id: string) {
    try {
      return await this.destinationService.toggleStatus(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(DestinationResponseDto)
  @UseInterceptors(FileInterceptor('flag', multerMemoryOptions))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDestinationDto,
    @UploadedFile(imageFilePipe(false)) file?: Express.Multer.File,
  ) {
    try {
      return await this.destinationService.update(id, dto, file);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.destinationService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}