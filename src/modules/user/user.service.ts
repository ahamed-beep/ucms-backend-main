import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<{ success: boolean; message: string; data?: { id: string } }> {
    try {
      const existing = await this.userModel.findOne({ emailId: registerDto.emailId });
      if (existing) {
        throw new ConflictException('Email already registered');
      }

      const hashed = await bcrypt.hash(registerDto.password, 10);

      const user = await this.userModel.create({
        firstName: registerDto.firstName.trim(),
        lastName: registerDto.lastName.trim(),
        emailId: registerDto.emailId.toLowerCase().trim(),
        password: hashed,
      });

      return {
        success: true,
        message: 'Registered successfully',
        data: { id: user._id.toString() },
      };
    } catch (error) {
      this.logger.error('createUser error:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ emailId: email.toLowerCase().trim() });
  }
}