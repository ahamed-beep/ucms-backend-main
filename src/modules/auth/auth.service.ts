import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from './email.service';
import { OTP_PURPOSE } from './constants/auth.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

 constructor(
  private readonly userService: UserService,
  private readonly jwtService: JwtService,
  private readonly emailService: EmailService,
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

  async forgotPassword(emailId: string) {
  try {
    const email = emailId.toLowerCase().trim();
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return { success: true, message: 'If this email exists, an OTP has been sent.' };
    }

    if (user.isDisabled) {
      return { success: false, status: 403, message: 'Account is disabled. Contact support.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

   const otpToken = this.jwtService.sign(
  { email, otp, purpose: OTP_PURPOSE.VERIFICATION },
  { expiresIn: '5m' },
);

    await this.emailService.sendOtpEmail(email, otp);

    return {
      success: true,
      message: 'OTP sent to your email.',
      otpToken, 
    };
  } catch (error) {
    this.logger.error('forgotPassword error:', error);
    throw error;
  }
}

async resendOtp(emailId: string) {
  try {
    const email = emailId.toLowerCase().trim();
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return { success: true, message: 'If this email exists, an OTP has been sent.' };
    }

    if (user.isDisabled) {
      return { success: false, status: 403, message: 'Account is disabled. Contact support.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpToken = this.jwtService.sign(
      { email, otp, purpose: 'otp-verification' },
      { expiresIn: '5m' },
    );

    await this.emailService.sendOtpEmail(email, otp);

    return {
      success: true,
      message: 'OTP resent to your email.',
      otpToken,
    };
  } catch (error) {
    this.logger.error('resendOtp error:', error);
    throw error;
  }
}

async verifyOtp(emailId: string, otp: string, otpToken: string) {
  try {
    const email = emailId.toLowerCase().trim();

    let payload: { email: string; otp: string; purpose: string };

    try {
      payload = this.jwtService.verify(otpToken);
    } catch {
      return { success: false, status: 401, message: 'OTP expired. Please request a new one.' };
    }

    if (payload.purpose !== OTP_PURPOSE.VERIFICATION) {
  return { success: false, status: 401, message: 'Invalid token.' };
}

    if (payload.email !== email) {
      return { success: false, status: 401, message: 'Email mismatch.' };
    }

    if (payload.otp !== otp) {
      return { success: false, status: 400, message: 'Invalid OTP.' };
    }

  const resetToken = this.jwtService.sign(
  { email, purpose: OTP_PURPOSE.PASSWORD_RESET },
  { expiresIn: '10m' },
);

    return {
      success: true,
      message: 'OTP verified successfully.',
      resetToken,
    };
  } catch (error) {
    this.logger.error('verifyOtp error:', error);
    throw error;
  }
}

async resetPassword(resetToken: string, newPassword: string) {
  try {
    let payload: { email: string; purpose: string };

    try {
      payload = this.jwtService.verify(resetToken);
    } catch {
      return { success: false, status: 401, message: 'Reset token is invalid or expired.' };
    }

   if (payload.purpose !== OTP_PURPOSE.PASSWORD_RESET) {
  return { success: false, status: 401, message: 'Invalid reset token.' };
}

    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      return { success: false, status: 404, message: 'User not found.' };
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(payload.email, hashed);

    return { success: true, message: 'Password reset successfully.' };
  } catch (error) {
    this.logger.error('resetPassword error:', error);
    throw error;
  }
}
}