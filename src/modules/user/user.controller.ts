import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllUsersResponseDto } from './dto/get-all-users-response.dto';
import { ToggleUserStatusResponseDto } from './dto/toggle-user-status-response.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { SerializeResponse } from '../../common/interceptors/serialize.interceptor';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UserDataDto } from './dto/user-data.dto';

@Controller('admin/users')
@UseGuards(RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @RequireRole('admin')
  @HttpCode(HttpStatus.CREATED)
  @SerializeResponse(CreateUserResponseDto)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.adminCreateUser(createUserDto);
    } catch (error) {
      this.logger.error('createUser error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(GetAllUsersResponseDto ,UserDataDto)
  async getAllUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      this.logger.error('getAllUsers error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/status')
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(ToggleUserStatusResponseDto)
  async toggleUserStatus(@Param('id') id: string) {
    try {
      const result = await this.userService.toggleUserStatus(id);
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      this.logger.error('toggleUserStatus error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @RequireRole('admin')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(UpdateUserResponseDto)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const result = await this.userService.updateUserByAdmin(id, updateUserDto);
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      this.logger.error('updateUser error:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('by-course/:courseId')
@RequireRole('admin')
@HttpCode(HttpStatus.OK)
@SerializeResponse(GetAllUsersResponseDto, UserDataDto)
async getUsersByCourse(@Param('courseId') courseId: string) {
  try {
    return await this.userService.getUsersByCourse(courseId);
  } catch (error) {
    this.logger.error('getUsersByCourse error:', error);
    if (error instanceof HttpException) throw error;
    throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}