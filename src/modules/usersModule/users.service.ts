import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Services
import { PrismaService } from 'src/prisma/prisma.service';

// Dto's
import { CreateUserDTO, UpdateUserDto, UserCredentialsDTO } from './user.dto';

// Types
import {
  UserSelectPayload,
  UserTypesSelectPayload,
} from 'src/types/prismaTypes';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDTO): Promise<UserSelectPayload> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        roleId: data.roleId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        roleId: true,
      },
    });
  }

  async getUsers(): Promise<UserSelectPayload[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        roleId: true,
      },
    });
  }

  async getUserTypes(): Promise<UserTypesSelectPayload[]> {
    return await this.prisma.userType.findMany({
      select: {
        id: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async getUserTypesById(id: string): Promise<UserTypesSelectPayload> {
    return await this.prisma.userType.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async getUserById(id: string): Promise<UserSelectPayload> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        roleId: true,
      },
    });
  }

  async userSignIn(
    credentials: UserCredentialsDTO,
  ): Promise<{ token: string; userId: string; roleType: string }> {
    // Find user with email
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
      select: {
        id: true,
        email: true,
        password: true,
        roleId: true,
        userType: {
          select: {
            type: true,
          },
        },
      },
    });

    // Use generic error message for security (don't reveal if email exists)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const passwordIsValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Create JWT token
    const token = this.generateJwtToken(user.id, user.roleId);

    return {
      token,
      userId: user.id,
      roleType: user.userType.type,
    };
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<UserSelectPayload> {
    return await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        roleId: true,
      },
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  private generateJwtToken(userId: string, roleId: string): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
      {
        userId,
        roleId,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );
  }
}
