import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ConsultationSlotService } from './consultation-slot.service';
import {
  CreateConsultationSlotDto,
  UpdateConsultationSlotDto,
} from './dto/consultation-slot.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RequireRole } from 'src/common/decorators/roles.decorator';

@Controller('consultation-slots')
export class ConsultationSlotController {
  constructor(private readonly slotService: ConsultationSlotService) {}

  @Public()
  @Get('active')
  async getActive() {
    const data = await this.slotService.findActive();
    return { message: 'Active slots fetched', data };
  }

  @RequireRole('admin')
  @Post()
  async create(@Body() dto: CreateConsultationSlotDto) {
    const data = await this.slotService.create(dto);
    return { message: 'Slot created successfully', data };
  }

  @RequireRole('admin')
  @Get()
  async findAll() {
    const data = await this.slotService.findAll();
    return { message: 'All slots fetched', data };
  }

  @RequireRole('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateConsultationSlotDto,
  ) {
    const data = await this.slotService.update(id, dto);
    return { message: 'Slot updated successfully', data };
  }

  @RequireRole('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.slotService.delete(id);
    return { message: 'Slot deleted successfully' };
  }
}