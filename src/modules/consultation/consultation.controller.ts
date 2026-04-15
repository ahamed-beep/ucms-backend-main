import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { Public } from 'src/common/decorators/public.decorator';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { UpdateConsultationStatusDto } from './dto/consultation-list-response.dto';
import { ApiResponseDto } from 'src/common/decorators/api-response.dto';

@Controller('consultations')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Public()
  @Post()
  @SerializeResponse(ApiResponseDto(ConsultationResponseDto))
  async create(@Body() dto: CreateConsultationDto) {
    try {
      const consultation = await this.consultationService.create(dto);
      return { message: 'Consultation booked successfully', data: consultation };
    } catch (error) {
      throw error;
    }
  }

  @RequireRole('admin')
  @Get()
  @SerializeResponse(ConsultationResponseDto)
  async getAll() {
    try {
      const data = await this.consultationService.findAll();
      return { message: 'All consultations fetched', data, total: data.length };
    } catch (error) {
      throw error;
    }
  }

  @RequireRole('admin')
  @Get('filter/unread')
  @SerializeResponse(ConsultationResponseDto)
  async getUnread() {
    try {
      const data = await this.consultationService.findUnread();
      return { message: 'Unread consultations fetched', data, total: data.length };
    } catch (error) {
      throw error;
    }
  }

  @RequireRole('admin')
  @Get('filter/read')
  @SerializeResponse(ConsultationResponseDto)
  async getRead() {
    try {
      const data = await this.consultationService.findRead();
      return { message: 'Read consultations fetched', data, total: data.length };
    } catch (error) {
      throw error;
    }
  }

  @RequireRole('admin')
  @Get(':id')
  @SerializeResponse(ApiResponseDto(ConsultationResponseDto))
  async findOne(@Param('id') id: string) {
    try {
      const consultation = await this.consultationService.findById(id);
      return { message: 'Consultation fetched successfully', data: consultation };
    } catch (error) {
      throw error;
    }
  }

  @RequireRole('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.consultationService.delete(id);
      return { message: 'Consultation deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  @RequireRole('admin')
  @Patch(':id/status')
  @SerializeResponse(ApiResponseDto(ConsultationResponseDto))
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateConsultationStatusDto) {
    try {
      const consultation = await this.consultationService.updateStatus(id, dto);
      return { message: 'Consultation status updated', data: consultation };
    } catch (error) {
      throw error;
    }
  }
}