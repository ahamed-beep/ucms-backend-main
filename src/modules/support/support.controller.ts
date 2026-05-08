import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportStatusDto } from './dto/update-support-status.dto';
import { SupportResponseDto } from './dto/support-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@SerializeResponse(SupportResponseDto)
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
    @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('student')
  async create(@Body() dto: CreateSupportDto) {
    try {
      return await this.supportService.create(dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to submit support request');
    }
  }

  @Get()
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async findAll() {
    try {
      return await this.supportService.findAll();
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch support requests');
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async findById(@Param('id') id: string) {
    try {
      return await this.supportService.findById(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch support request');
    }
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateSupportStatusDto) {
    try {
      return await this.supportService.updateStatus(id, dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to update status');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  async delete(@Param('id') id: string) {
    try {
      return await this.supportService.delete(id);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete support request');
    }
  }
}