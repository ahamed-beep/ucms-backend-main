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
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { UpcomingClassService } from './upcoming-class.service';

import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { UpcomingClassResponseDto } from './dto/upcoming-class-response.dto';
import { CreateUpcomingClassDto } from './dto/create-upcoming-class.dto';
import { PaginatedUpcomingClassResponseDto } from './dto/paginated-upcoming-class-response.dto';
import { UpcomingClassQueryDto } from './dto/upcoming-class-query.dto';
import { UpdateUpcomingClassDto } from './dto/update-upcoming-class-dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('upcoming-classes')
export class UpcomingClassController {
  constructor(private readonly upcomingClassService: UpcomingClassService) {}

  @Post()
    @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @SerializeResponse(UpcomingClassResponseDto)
  async create(@Body() dto: CreateUpcomingClassDto) {
    try {
      return await this.upcomingClassService.create(dto);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to create class');
    }
  }

  @Get()
  @Public()
  @SerializeResponse(PaginatedUpcomingClassResponseDto, UpcomingClassResponseDto)
  async findAll(@Query() query: UpcomingClassQueryDto) {
    try {
      return await this.upcomingClassService.findAll(query);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch classes');
    }
  }

  @Get(':id')
  @Public()
  @SerializeResponse(UpcomingClassResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.upcomingClassService.findOne(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to fetch class');
    }
  }

  @Patch(':id')
    @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @SerializeResponse(UpcomingClassResponseDto)
  async update(@Param('id') id: string, @Body() dto: UpdateUpcomingClassDto) {
    try {
      return await this.upcomingClassService.update(id, dto);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to update class');
    }
  }

  @Delete(':id')
    @UseGuards(RolesGuard, ActiveGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.upcomingClassService.remove(id);
    } catch (error: any) {
      if (error?.status) throw error;
      throw new InternalServerErrorException('Failed to delete class');
    }
  }
}