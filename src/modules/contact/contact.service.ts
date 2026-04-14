import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Contact, ContactDocument } from './entity/contact.entity';
import { ContactStatus } from './enums/contact-status.enum';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { buildAdminEmailTemplate } from './templates/admin-email.template';
import { buildUserEmailTemplate } from './templates/user-email.template';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMessage(createContactDto: CreateContactDto) {
    try {
      const contact = await this.contactModel.create({
        fullName: createContactDto.fullName,
        email: createContactDto.email,
        phone: createContactDto.phone,
        subject: createContactDto.subject,
        message: createContactDto.message,
      });

      this.sendEmailNotification(contact).catch((err) =>
        this.logger.error('Email notification failed:', err),
      );

      return {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon.',
        data: { id: contact._id.toString() },
      };
    } catch (error) {
      this.logger.error('sendMessage error:', error);
      throw new InternalServerErrorException('Failed to send message');
    }
  }

 private async sendEmailNotification(contact: ContactDocument): Promise<void> {
  const fromEmail = this.configService.get<string>('SMTP_USER');
  const siteName = this.configService.get<string>('SITE_NAME', 'EduConsult');

  await this.transporter.sendMail({
    from: `"${siteName} System" <${fromEmail}>`,
    to: fromEmail,
    subject: `📬 New Contact Message: ${contact.subject}`,
    html: buildAdminEmailTemplate(contact, siteName),
  });

  await this.transporter.sendMail({
    from: `"${siteName}" <${fromEmail}>`,
    to: contact.email,
    subject: `✅ We received your message — ${contact.subject}`,
    html: buildUserEmailTemplate(contact.fullName, contact.subject, siteName),
  });

  this.logger.log(`Admin + user emails sent for contact: ${contact._id}`);
}

 async getAllMessages() {
  try {
    const contacts = await this.contactModel.find().sort({ createdAt: -1 }).lean();
    const unreadCount = contacts.filter((c) => !c.isRead).length;

    return {
      success: true,
      message: 'Messages fetched successfully',
      total: contacts.length,
      unreadCount,
      data: contacts.map((c) => ({
        ...c,
        id: c._id.toString(),  // ✅ yeh pehle se tha
        _id: c._id.toString(), // ✅ yeh add karo
      })),
    };
  } catch (error) {
    this.logger.error('getAllMessages error:', error);
    throw new InternalServerErrorException('Failed to fetch messages');
  }
}

  async getMessageById(id: string) {
    try {
      const contact = await this.contactModel.findById(id);
      if (!contact) throw new NotFoundException('Message not found');

      if (!contact.isRead) {
        contact.isRead = true;
        contact.readAt = new Date();
        if (contact.status === ContactStatus.NEW) {
          contact.status = ContactStatus.READ;
        }
        await contact.save();
      }

      return {
        success: true,
        message: 'Message fetched successfully',
        data: { ...contact.toObject(), id: contact._id.toString() },
      };
    } catch (error) {
      this.logger.error('getMessageById error:', error);
      throw error;
    }
  }

  async markAsRead(id: string) {
    try {
      const contact = await this.contactModel.findById(id);
      if (!contact) throw new NotFoundException('Message not found');

      contact.isRead = true;
      contact.readAt = new Date();
      if (contact.status === ContactStatus.NEW) {
        contact.status = ContactStatus.READ;
      }
      await contact.save();

      return {
        success: true,
        message: 'Message marked as read',
        data: {
          id: contact._id.toString(),
          isRead: contact.isRead,
          status: contact.status,
          readAt: contact.readAt,
        },
      };
    } catch (error) {
      this.logger.error('markAsRead error:', error);
      throw error;
    }
  }

  async updateStatus(id: string, updateContactDto: UpdateContactDto) {
    try {
      const contact = await this.contactModel.findById(id);
      if (!contact) throw new NotFoundException('Message not found');

      if (updateContactDto.status) {
        contact.status = updateContactDto.status;
        if (updateContactDto.status !== ContactStatus.NEW && !contact.isRead) {
          contact.isRead = true;
          contact.readAt = new Date();
        }
      }

      await contact.save();

      return {
        success: true,
        message: 'Message status updated successfully',
        data: { ...contact.toObject(), id: contact._id.toString() },
      };
    } catch (error) {
      this.logger.error('updateStatus error:', error);
      throw error;
    }
  }

  async deleteMessage(id: string) {
    try {
      const contact = await this.contactModel.findByIdAndDelete(id);
      if (!contact) throw new NotFoundException('Message not found');

      return {
        success: true,
        message: 'Message deleted successfully',
      };
    } catch (error) {
      this.logger.error('deleteMessage error:', error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const count = await this.contactModel.countDocuments({ isRead: false });
      return {
        success: true,
        message: 'Unread count fetched',
        data: { unreadCount: count },
      };
    } catch (error) {
      this.logger.error('getUnreadCount error:', error);
      throw new InternalServerErrorException('Failed to get unread count');
    }
  }
}