import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/entities/user.entity';
import { JwtPayload, RequestUser } from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    if (!payload.userId) {
      throw new UnauthorizedException('Invalid token structure.');
    }

    const freshUser = await this.userModel.findById(payload.userId).select('-password');

    if (!freshUser) {
      throw new UnauthorizedException('User account no longer exists.');
    }

    if (freshUser.isDisabled) {
      throw new UnauthorizedException('Account is disabled.');
    }

    return {
      userId: freshUser._id.toString(),
      email: freshUser.emailId,
      firstName: freshUser.firstName,
      lastName: freshUser.lastName,
      role: freshUser.role || 'student',
      isDisabled: !!freshUser.isDisabled,
      sessionId: payload.sessionId,
    };
  }
}