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
import { AdmissionDeadlineService } from './admission.service';
import { CreateAdmissionDeadlineDto } from './dto/create-admission-deadline.dto';
import { UpdateAdmissionDeadlineDto } from './dto/update-admission-deadline.dto';
import { AdmissionDeadlineResponseDto, AdmissionDeadlineDataDto } from './dto/admission-deadline-response.dto';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { AdmissionDeadlineDocument } from './entities/admission-deadline.entity';
import { IAdmissionDeadlineResponse, IDeleteResponse } from './interfaces/admission-deadline.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

@Controller('admission-deadlines')
export class AdmissionDeadlineController {
  constructor(private readonly admissionDeadlineService: AdmissionDeadlineService) {}

  @Post()
  @RequireRole('admin')
  @UseGuards(RolesGuard, ActiveGuard)
  @SerializeResponse(AdmissionDeadlineResponseDto, AdmissionDeadlineDataDto)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAdmissionDeadlineDto): Promise<IAdmissionDeadlineResponse> {
    try {
      const record: AdmissionDeadlineDocument = await this.admissionDeadlineService.create(dto);
      return { success: true, data: record };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create admission deadline');
    }
  }

  @Get('admin')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(AdmissionDeadlineResponseDto, AdmissionDeadlineDataDto)
  async findAllAdmin(): Promise<IAdmissionDeadlineResponse> {
    try {
      const records: AdmissionDeadlineDocument[] = await this.admissionDeadlineService.findAllAdmin();
      return { success: true, data: records };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch admission deadlines');
    }
  }

  @Public()
  @Get()
  @SerializeResponse(AdmissionDeadlineResponseDto, AdmissionDeadlineDataDto)
  async findAll(): Promise<IAdmissionDeadlineResponse> {
    try {
      const records: AdmissionDeadlineDocument[] = await this.admissionDeadlineService.findAll();
      return { success: true, data: records };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch admission deadlines');
    }
  }

  @Public()
  @Get(':id')
  @SerializeResponse(AdmissionDeadlineResponseDto, AdmissionDeadlineDataDto)
  async findOne(@Param('id') id: string): Promise<IAdmissionDeadlineResponse> {
    try {
      const record: AdmissionDeadlineDocument = await this.admissionDeadlineService.findOne(id);
      return { success: true, data: record };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch admission deadline');
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(AdmissionDeadlineResponseDto, AdmissionDeadlineDataDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdmissionDeadlineDto,
  ): Promise<IAdmissionDeadlineResponse> {
    try {
      const record: AdmissionDeadlineDocument = await this.admissionDeadlineService.update(id, dto);
      return { success: true, data: record };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update admission deadline');
    }
  }

  @Patch(':id/toggle')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @SerializeResponse(AdmissionDeadlineResponseDto, AdmissionDeadlineDataDto)
  async toggleActive(@Param('id') id: string): Promise<IAdmissionDeadlineResponse> {
    try {
      const record: AdmissionDeadlineDocument = await this.admissionDeadlineService.toggleActive(id);
      return { success: true, data: record };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to toggle admission deadline');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async remove(@Param('id') id: string): Promise<IDeleteResponse> {
    try {
      return await this.admissionDeadlineService.remove(id);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete admission deadline');
    }
  }
}