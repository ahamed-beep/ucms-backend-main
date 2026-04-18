import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventListResponseDto } from './dto/event-list-response.dto';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import {
  IEvent,
  IEventListResponse,
  IDeleteResponse,
  IPaginationQuery,
} from './interfaces/event.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @SerializeResponse(EventResponseDto)
  async create(@Body() dto: CreateEventDto): Promise<IEvent> {
    return this.eventService.create(dto);
  }

  @Get()
  @Public()
  @SerializeResponse(EventListResponseDto, EventResponseDto)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<IEventListResponse> {
    return this.eventService.findAll(Number(page), Number(limit));
  }

  @Get('admin/all')
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @SerializeResponse(EventListResponseDto, EventResponseDto)
  async findAllAdmin(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<IEventListResponse> {
    return this.eventService.findAllAdmin(Number(page), Number(limit));
  }

  @Get(':id')
  @SerializeResponse(EventResponseDto)
  async findOne(@Param('id') id: string): Promise<IEvent> {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @SerializeResponse(EventResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<IEvent> {
    return this.eventService.update(id, dto);
  }

  @Patch(':id/status')
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  @SerializeResponse(EventResponseDto)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEventStatusDto,
  ): Promise<IEvent> {
    return this.eventService.updateStatus(id, dto);
  }

  @Delete(':id')
   @UseGuards(RolesGuard, ActiveGuard)
    @RequireRole('admin')
  async remove(@Param('id') id: string): Promise<IDeleteResponse> {
    return this.eventService.remove(id);
  }
}