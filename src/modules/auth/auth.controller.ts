import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  
@Public()
  @SerializeResponse(RegisterResponseDto)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error('register error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @SerializeResponse(LoginResponseDto)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto.emailId, loginDto.password);

      if (!result.success) {
        throw new HttpException(result.message, result.status ?? HttpStatus.UNAUTHORIZED);
      }

      return result;
    } catch (error) {
      this.logger.error('login error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 @Public()
@Post('forgot-password')
@HttpCode(HttpStatus.OK)
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  try {
    const result = await this.authService.forgotPassword(dto.emailId);

    if (!result.success) {
      throw new HttpException(result.message, result.status ?? HttpStatus.BAD_REQUEST);
    }

    return result;
  } catch (error) {
    this.logger.error('forgotPassword error:', error);
    if (error instanceof HttpException) throw error;
    throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Public()
@Post('resend-otp')
@HttpCode(HttpStatus.OK)
async resendOtp(@Body() dto: ResendOtpDto) {
  try {
    const result = await this.authService.resendOtp(dto.emailId);

    if (!result.success) {
      throw new HttpException(result.message, result.status ?? HttpStatus.BAD_REQUEST);
    }

    return result;
  } catch (error) {
    this.logger.error('resendOtp error:', error);
    if (error instanceof HttpException) throw error;
    throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Public()
@Post('verify-otp')
@HttpCode(HttpStatus.OK)
async verifyOtp(@Body() dto: VerifyOtpDto) {
  try {
    const result = await this.authService.verifyOtp(dto.emailId, dto.otp, dto.otpToken);
    if (!result.success) {
      throw new HttpException(result.message, result.status ?? HttpStatus.BAD_REQUEST);
    }
    return result;
  } catch (error) {
    this.logger.error('verifyOtp error:', error);
    if (error instanceof HttpException) throw error;
    throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Public()
@Post('reset-password')
@HttpCode(HttpStatus.OK)
async resetPassword(@Body() dto: ResetPasswordDto) {
  try {
    const result = await this.authService.resetPassword(dto.resetToken, dto.newPassword);
    if (!result.success) {
      throw new HttpException(result.message, result.status ?? HttpStatus.BAD_REQUEST);
    }
    return result;
  } catch (error) {
    this.logger.error('resetPassword error:', error);
    if (error instanceof HttpException) throw error;
    throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}