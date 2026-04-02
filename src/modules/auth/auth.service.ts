import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const result = await this.userService.createUser(registerDto);

      if (!result.success || !result.data?.id) {
        throw new BadRequestException(result.message || 'Registration failed');
      }

      return {
        success: true,
        message: result.message,
        userId: result.data.id,
      };
    } catch (error) {
      this.logger.error('register error:', error);
      throw error;
    }
  }

  async login(emailId: string, password: string) {
    try {
      const normalizedEmail = emailId.toLowerCase().trim();
      const user = await this.userService.findByEmail(normalizedEmail);

      if (!user) {
        await bcrypt.compare(password, '$2b$10$dummyhashtopreventtimingattacks00');
        return { success: false, status: 401, message: 'Invalid email or password' };
      }

      if (user.isDisabled) {
        return { success: false, status: 403, message: 'Account is disabled. Contact support.' };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, status: 401, message: 'Invalid email or password' };
      }

      const token = this.jwtService.sign({
        userId: user._id.toString(),
        email: user.emailId,
        role: user.role,
      });

      return {
        success: true,
        status: 200,
        message: 'Login successful',
        token,
        data: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailId,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error('login error:', error);
      throw error;
    }
  }
}