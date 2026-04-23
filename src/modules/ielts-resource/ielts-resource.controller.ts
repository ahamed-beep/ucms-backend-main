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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryOptions } from '../cloudinary/multer.config';
import { IeltsResourceService } from './ielts-resource.service';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { IeltsResourceResponseDto } from './dto/Ielts-resource-response.dto';
import { CreateIeltsResourceDto } from './dto/createIelts-resource.dto';
import { PaginatedIeltsResourceResponseDto } from './dto/paginated-Ielts-resource-response.dto';
import { IeltsResourceQueryDto } from './dto/Ielts-resource-query.dto';
import { UpdateIeltsResourceDto } from './dto/updateIelts-resource.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

const pdfFilePipe = (required: boolean) =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }),
      new FileTypeValidator({ fileType: /application\/pdf/ }),
    ],
    fileIsRequired: required,
  });

@Controller('ielts-resources')
export class IeltsResourceController {
  constructor(private readonly ieltsResourceService: IeltsResourceService) {}

  @Post()
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  @SerializeResponse(IeltsResourceResponseDto)
  async create(
    @Body() dto: CreateIeltsResourceDto,
    @UploadedFile(pdfFilePipe(true))
    file: Express.Multer.File,
  ) {
    try {
      return await this.ieltsResourceService.create(dto, file);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create IELTS resource');
    }
  }

  @Get()
  @Public()
  @SerializeResponse(PaginatedIeltsResourceResponseDto, IeltsResourceResponseDto)
  async findAll(@Query() query: IeltsResourceQueryDto) {
    try {
      return await this.ieltsResourceService.findAll(query);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch IELTS resources');
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(IeltsResourceResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.ieltsResourceService.findOne(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch IELTS resource');
    }
  }

  @Patch(':id')
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  @SerializeResponse(IeltsResourceResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIeltsResourceDto,
    @UploadedFile(pdfFilePipe(false))
    file?: Express.Multer.File,
  ) {
    try {
      return await this.ieltsResourceService.update(id, dto, file);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to update IELTS resource');
    }
  }

  @Delete(':id')
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.ieltsResourceService.remove(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to delete IELTS resource');
    }
  }

  @Post(':id/download')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackDownload(@Param('id') id: string) {
    try {
      await this.ieltsResourceService.incrementDownload(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to track download');
    }
  }
}