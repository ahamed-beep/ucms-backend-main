import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequireRole } from '../../common/decorators/roles.decorator';
import { DeleteContactResponseDto } from './dto/delete-contact-response.dto';
import { UpdateContactResponseDto } from './dto/update-contact-response.dto';
import { MarkReadResponseDto } from './dto/mark-read-response.dto';
import { GetContactResponseDto } from './dto/get-contact-response.dto';
import { GetAllContactsResponseDto } from './dto/get-all-contacts-response.dto';
import { SendContactResponseDto } from './dto/send-contact-response.dto';
import { UnreadCountResponseDto } from './dto/unread-count-response.dto';
import { ContactDataDto } from './dto/contact-data.dto';

@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}


  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SerializeResponse(SendContactResponseDto)
  async sendMessage(@Body() createContactDto: CreateContactDto) {
    try {
      return await this.contactService.sendMessage(createContactDto);
    } catch (error) {
      this.logger.error('sendMessage error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('admin/messages')
  @UseGuards(RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
@SerializeResponse(GetAllContactsResponseDto, ContactDataDto) 
  async getAllMessages() {
    try {
      return await this.contactService.getAllMessages();
    } catch (error) {
      this.logger.error('getAllMessages error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('admin/messages/unread-count')
  @UseGuards(RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(UnreadCountResponseDto)
  async getUnreadCount() {
    try {
      return await this.contactService.getUnreadCount();
    } catch (error) {
      this.logger.error('getUnreadCount error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('admin/messages/:id')
  @UseGuards(RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(GetContactResponseDto)
  async getMessageById(@Param('id') id: string) {
    try {
      return await this.contactService.getMessageById(id);
    } catch (error) {
      this.logger.error('getMessageById error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Patch('admin/messages/:id/read')
  @UseGuards(RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(MarkReadResponseDto)
  async markAsRead(@Param('id') id: string) {
    try {
      return await this.contactService.markAsRead(id);
    } catch (error) {
      this.logger.error('markAsRead error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Patch('admin/messages/:id')
  @UseGuards(RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(UpdateContactResponseDto)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    try {
      return await this.contactService.updateStatus(id, updateContactDto);
    } catch (error) {
      this.logger.error('updateStatus error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Delete('admin/messages/:id')
  @UseGuards(RolesGuard)
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(DeleteContactResponseDto)
  async deleteMessage(@Param('id') id: string) {
    try {
      return await this.contactService.deleteMessage(id);
    } catch (error) {
      this.logger.error('deleteMessage error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}