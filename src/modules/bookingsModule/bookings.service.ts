import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingSelectedPayload } from 'src/types/prismaTypes';
import { CreateBookingDTO, UpdateBookingDto } from './bookings.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async getTalentBookings(talentId: string): Promise<BookingSelectedPayload[]> {
    return await this.prisma.booking.findMany({
      where: { talentId: talentId },
      select: {
        start: true,
        end: true,
        talent: {
          select: {
            talent: true,
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        status: true,
      },
    });
  }

  async getTalentBookingById(id: string): Promise<BookingSelectedPayload> {
    return await this.prisma.booking.findUniqueOrThrow({
      where: { id },
      select: {
        start: true,
        end: true,
        talent: {
          select: {
            talent: true,
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        status: true,
      },
    });
  }

  async requestBooking(
    data: CreateBookingDTO,
  ): Promise<BookingSelectedPayload> {
    return await this.prisma.booking.create({
      data: {
        talentId: data.talentId,
        start: data.start,
        end: data.start,
      },
      select: {
        start: true,
        end: true,
        talent: {
          select: {
            talent: true,
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        status: true,
      },
    });
  }

  async rescheduleBooking(
    id: string,
    data: UpdateBookingDto,
  ): Promise<BookingSelectedPayload> {
    return await this.prisma.booking.update({
      where: { id },
      data,
      select: {
        start: true,
        end: true,
        talent: {
          select: {
            talent: true,
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        status: true,
      },
    });
  }

  async cancelBooking(id: string): Promise<BookingSelectedPayload> {
    return await this.prisma.booking.update({
      where: { id },
      data: { status: 'Cancel' },
      select: {
        start: true,
        end: true,
        talent: {
          select: {
            talent: true,
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        status: true,
      },
    });
  }
}
