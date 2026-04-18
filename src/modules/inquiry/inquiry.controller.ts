import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { InquiryResponseDto, InquiryDataDto } from './dto/inquiry-response.dto';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { InquiryDocument } from './entities/inquiry.entity';
import { IInquiryResponse, IDeleteResponse } from './interfaces/inquiry.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Public()
  @Post()
  @SerializeResponse(InquiryResponseDto, InquiryDataDto)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInquiryDto): Promise<IInquiryResponse> {
    try {
      const inquiry: InquiryDocument = await this.inquiryService.create(dto);
      return { success: true, data: inquiry };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to submit inquiry');
    }
  }

  @Get()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(InquiryResponseDto, InquiryDataDto)
  async findAll(): Promise<IInquiryResponse> {
    try {
      const inquiries: InquiryDocument[] = await this.inquiryService.findAll();
      return { success: true, data: inquiries };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch inquiries');
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(InquiryResponseDto, InquiryDataDto)
  async findOne(@Param('id') id: string): Promise<IInquiryResponse> {
    try {
      const inquiry: InquiryDocument = await this.inquiryService.findOne(id);
      return { success: true, data: inquiry };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch inquiry');
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(InquiryResponseDto, InquiryDataDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInquiryDto,
  ): Promise<IInquiryResponse> {
    try {
      const inquiry: InquiryDocument = await this.inquiryService.update(id, dto);
      return { success: true, data: inquiry };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update inquiry');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async remove(@Param('id') id: string): Promise<IDeleteResponse> {
    try {
      return await this.inquiryService.remove(id);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete inquiry');
    }
  }
}