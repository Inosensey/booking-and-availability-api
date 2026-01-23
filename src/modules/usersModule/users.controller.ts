import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';

// Guards
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permission.guard';

// Interceptors
import { CookieCheckInterceptor } from 'src/interceptors/cookieCheck.interceptor';

// utils
import { ApiResponse } from 'src/utils/responseShaper';

// Service
import { UserService } from './users.service';

// Types
import { CreateUserDTO, UpdateUserDto, UserCredentialsDTO } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return ApiResponse.success(users, 'Users retrieved successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Get('/:id')
  async getUserById(@Param('id') userId: string) {
    const user = await this.userService.getUserById(userId);
    return ApiResponse.success(user, 'User retrieved successfully');
  }
  @Get('/roles')
  async getRoles() {
    const roles = await this.userService.getUserTypes();
    return ApiResponse.success(roles, 'Roles retrieved successfully');
  }
  @Get('/roles/:id')
  async getUserTypesById(@Param('id') roleId: string) {
    const role = await this.userService.getUserTypesById(roleId);
    return ApiResponse.success(role, 'Role retrieved successfully');
  }

  @Post('auth/sign-up')
  async createUser(
    @Body()
    user: CreateUserDTO,
  ) {
    const result = await this.userService.createUser(user);
    return ApiResponse.success(result, 'User created successfully');
  }

  @Post('auth/sign-in')
  @HttpCode(200)
  @UseInterceptors(CookieCheckInterceptor)
  async signInUser(
    @Body()
    credentials: UserCredentialsDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.userService.userSignIn(credentials);

    response.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 3600000,
    });
    return ApiResponse.success(
      {
        userId: result.userId,
        roleType: result.roleType,
      },
      'User signed in successfully',
    );
  }

  @Post('auth/sign-out')
  @HttpCode(200)
  @UseInterceptors(CookieCheckInterceptor)
  signOutUser(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
    });
    return ApiResponse.success(null, 'Signed out successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Put('/update/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body()
    data: UpdateUserDto,
  ) {
    const result = await this.userService.updateUser(userId, data);
    return ApiResponse.success(result, 'User updated successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Delete('/delete/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const result = await this.userService.deleteUser(userId);
    return ApiResponse.success(result, 'User deleted successfully');
  }
}
