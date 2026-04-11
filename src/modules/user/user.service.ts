import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { IUser } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(registerDto: RegisterDto) {
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

  async adminCreateUser(createUserDto: CreateUserDto) {
    try {
      const existing = await this.userModel.findOne({ emailId: createUserDto.emailId });
      if (existing) {
        throw new ConflictException('Email already registered');
      }

      const hashed = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.userModel.create({
        firstName: createUserDto.firstName.trim(),
        lastName: createUserDto.lastName.trim(),
        emailId: createUserDto.emailId.toLowerCase().trim(),
        password: hashed,
        role: createUserDto.role ?? 'student',
      });

      return {
        success: true,
        message: 'User created successfully',
        data: { id: user._id.toString() },
      };
    } catch (error) {
      this.logger.error('adminCreateUser error:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<(IUser & UserDocument) | null> {
    return this.userModel.findOne({ emailId: email.toLowerCase().trim() });
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.userModel.updateOne(
      { emailId: email.toLowerCase().trim() },
      { password: hashedPassword },
    );
  }

  async getAllUsers() {
    try {
      const users = await this.userModel
        .find({}, { password: 0 })
        .sort({ createdAt: -1 })
        .lean();

      return {
        success: true,
        message: 'Users fetched successfully',
        total: users.length,
        data: users,
      };
    } catch (error) {
      this.logger.error('getAllUsers error:', error);
      throw error;
    }
  }

  async toggleUserStatus(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      user.isDisabled = !user.isDisabled;
      await user.save();

      return {
        success: true,
        message: user.isDisabled ? 'User deactivated successfully' : 'User activated successfully',
        data: {
          id: user._id.toString(),
          isDisabled: user.isDisabled,
        },
      };
    } catch (error) {
      this.logger.error('toggleUserStatus error:', error);
      throw error;
    }
  }

  async updateUserByAdmin(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      if (updateUserDto.emailId) {
        const normalized = updateUserDto.emailId.toLowerCase().trim();
        const emailTaken = await this.userModel.findOne({
          emailId: normalized,
          _id: { $ne: userId },
        });
        if (emailTaken) throw new ConflictException('Email already in use by another user');
        user.emailId = normalized;
      }

      if (updateUserDto.firstName) user.firstName = updateUserDto.firstName.trim();
      if (updateUserDto.lastName) user.lastName = updateUserDto.lastName.trim();
      if (updateUserDto.password) user.password = await bcrypt.hash(updateUserDto.password, 10);

      await user.save();

      return {
        success: true,
        message: 'User updated successfully',
        data: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailId,
          role: user.role,
          isDisabled: user.isDisabled,
        },
      };
    } catch (error) {
      this.logger.error('updateUserByAdmin error:', error);
      throw error;
    }
  }
}