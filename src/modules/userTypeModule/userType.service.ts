import { Injectable } from '@nestjs/common';

// Services
import { PrismaService } from 'src/prisma/prisma.service';

// Dto's
import { CreateUserTypeDTO, UpdateUserTypeDto } from './userType.dto';

// Types
import { UserTypesSelectPayload } from 'src/types/prismaTypes';

@Injectable()
export class UserTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserType(
    data: CreateUserTypeDTO,
  ): Promise<UserTypesSelectPayload> {
    return this.prisma.userType.create({
      data: {
        type: data.type,
      },
      select: {
        id: true,
        type: true,
        createdAt: true,
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

  async getUserTypeById(id: string): Promise<UserTypesSelectPayload> {
    return await this.prisma.userType.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async updateUserType(
    id: string,
    data: UpdateUserTypeDto,
  ): Promise<UserTypesSelectPayload> {
    return await this.prisma.userType.update({
      where: { id },
      data,
      select: {
        id: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async deleteUserType(id: string) {
    return await this.prisma.userType.delete({
      where: { id },
    });
  }
}
