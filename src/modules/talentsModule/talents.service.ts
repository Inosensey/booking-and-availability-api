import { Injectable } from '@nestjs/common';

// Services
import { PrismaService } from 'src/prisma/prisma.service';

// DTOs
import { CreateTalentDTO, UpdateTalentDTO } from './talents.dto';

// Types
import { TalentSelectedPayload } from 'src/types/prismaTypes';

@Injectable()
export class TalentService {
  constructor(private readonly prisma: PrismaService) {}

  async createTalent(data: CreateTalentDTO): Promise<TalentSelectedPayload> {
    return await this.prisma.talent.create({
      data: {
        talent: data.talent,
        userId: data.userId,
      },
      select: {
        id: true,
        talent: true,
        userId: true,
        isActive: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async searchTalents(value: string): Promise<TalentSelectedPayload[]> {
    return await this.prisma.talent.findMany({
      where: {
        OR: [
          { talent: { contains: value, mode: 'insensitive' } },
          { User: { firstName: { contains: value, mode: 'insensitive' } } },
          { User: { lastName: { contains: value, mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        talent: true,
        userId: true,
        isActive: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateTalent(
    id: string,
    userId: string,
    data: UpdateTalentDTO,
  ): Promise<TalentSelectedPayload> {
    return await this.prisma.talent.update({
      where: {
        userId: userId,
        id: id,
      },
      data: {
        talent: data.talent,
      },
      select: {
        id: true,
        talent: true,
        userId: true,
        isActive: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteTalent(id: string) {
    return await this.prisma.talent.delete({
      where: { id },
    });
  }

  async getTalents(): Promise<TalentSelectedPayload[]> {
    return await this.prisma.talent.findMany({
      select: {
        id: true,
        talent: true,
        userId: true,
        isActive: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getTalentsByTalent(talent: string): Promise<TalentSelectedPayload> {
    return await this.prisma.talent.findFirstOrThrow({
      where: { talent: talent },
      select: {
        id: true,
        talent: true,
        userId: true,
        isActive: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
