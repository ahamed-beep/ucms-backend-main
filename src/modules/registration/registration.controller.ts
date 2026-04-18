import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';
import { RegistrationListResponseDto } from './dto/registration-list-response.dto';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';

@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @Public()
  @SerializeResponse(RegistrationResponseDto)
  async create(@Body() dto: CreateRegistrationDto) {
    try {
      return await this.registrationService.create(dto);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to create registration',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
   @UseGuards(RolesGuard, ActiveGuard)
      @RequireRole('admin')
  @SerializeResponse(RegistrationListResponseDto, RegistrationResponseDto)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      return await this.registrationService.findAll(Number(page), Number(limit));
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch registrations',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('event/:eventId')
  @SerializeResponse(RegistrationListResponseDto, RegistrationResponseDto)
  async findByEvent(
    @Param('eventId') eventId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      return await this.registrationService.findByEvent(
        eventId,
        Number(page),
        Number(limit),
      );
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch registrations for event',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @SerializeResponse(RegistrationResponseDto)
  async findOne(@Param('id') id: string) {
    try {
      return await this.registrationService.findOne(id);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Registration not found',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/status')
    @UseGuards(RolesGuard, ActiveGuard)
      @RequireRole('admin')
  @SerializeResponse(RegistrationResponseDto)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationStatusDto,
  ) {
    try {
      return await this.registrationService.updateStatus(id, dto);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to update registration status',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
    @UseGuards(RolesGuard, ActiveGuard)
      @RequireRole('admin')
  async remove(@Param('id') id: string) {
    try {
      return await this.registrationService.remove(id);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to delete registration',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}