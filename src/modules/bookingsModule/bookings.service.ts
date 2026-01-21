import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingSelectedPayload } from 'src/types/prismaTypes';
import { CreateBookingDTO, RescheduleBookingDto } from './bookings.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async getTalentBookings(talentId: string): Promise<BookingSelectedPayload[]> {
    return await this.prisma.booking.findMany({
      where: { talentId: talentId },
      select: {
        id: true,
        talentId: true,
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
        id: true,
        talentId: true,
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
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    const now = new Date();

    if (startDate >= endDate) {
      throw new BadRequestException('End time must be after start time');
    }

    if (startDate < now) {
      throw new BadRequestException('Cannot book in the past');
    }

    const durationMs = endDate.getTime() - startDate.getTime();
    const durationMinutes = durationMs / (1000 * 60);
    if (durationMinutes < 30) {
      throw new BadRequestException('Minimum booking duration is 30 minutes');
    }

    if (durationMinutes > 24 * 60) {
      throw new BadRequestException('Maximum booking duration is 24 hours');
    }

    const hasBooking = await this.checkForOverlappingBookings(
      startDate,
      endDate,
      data.talentId,
    );

    if (hasBooking) {
      throw new ConflictException(
        'Talent is already booked during this time. Please choose a different time.',
      );
    }

    return await this.prisma.booking.create({
      data: {
        userId: data.userId,
        talentId: data.talentId,
        start: startDate,
        end: endDate,
        status: 'pending',
      },
      select: {
        id: true,
        talentId: true,
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
    data: RescheduleBookingDto,
  ): Promise<BookingSelectedPayload> {
    return await this.prisma.booking.update({
      where: { id },
      data,
      select: {
        id: true,
        talentId: true,
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
        id: true,
        start: true,
        end: true,
        talentId: true,
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

  async updateBooking(
    action: 'accept' | 'reject',
    id: string,
  ): Promise<BookingSelectedPayload> {
    const now = new Date();
    const bookingDetails = await this.getTalentBookingById(id);

    if (!bookingDetails) {
      throw new NotFoundException('Booking not found');
    }

    if (bookingDetails.status !== 'pending') {
      throw new BadRequestException(
        `Cannot ${action} a booking that is ${bookingDetails.status}`,
      );
    }

    switch (action) {
      case 'accept': {
        if (now > bookingDetails.start) {
          await this.cancelBooking(id);
          throw new BadRequestException(
            'Cannot accept booking that is already past the current date. This booking will automatically get canceled',
          );
        }
        const hasOverlap = await this.checkForOverlappingConfirmedBookings(
          bookingDetails.start,
          bookingDetails.end,
          bookingDetails.talentId,
          id,
        );
        if (hasOverlap) {
          await this.rejectBooking(id);
          throw new ConflictException(
            'Time slot is no longer available. Another booking has been confirmed for this time.',
          );
        }
        return await this.acceptBooking(id);
      }
      case 'reject':
        return await this.rejectBooking(id);
      default:
        throw new BadRequestException('Invalid action');
    }
  }

  private async acceptBooking(id: string): Promise<BookingSelectedPayload> {
    return await this.prisma.booking.update({
      where: { id },
      data: { status: 'confirmed' },
      select: {
        id: true,
        talentId: true,
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

  private async rejectBooking(id: string): Promise<BookingSelectedPayload> {
    return await this.prisma.booking.update({
      where: { id },
      data: { status: 'rejected' },
      select: {
        id: true,
        talentId: true,
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

  private async checkForOverlappingConfirmedBookings(
    start: Date,
    end: Date,
    talentId: string,
    excludeBookingId: string,
  ): Promise<boolean> {
    const overlappingCount = await this.prisma.booking.count({
      where: {
        id: { not: excludeBookingId },
        talentId,
        status: 'confirmed',
        start: { lt: end },
        end: { gt: start },
      },
    });

    return overlappingCount > 0;
  }

  private async checkForOverlappingBookings(
    newReqStart: Date,
    newReqEnd: Date,
    talentId: string,
  ): Promise<boolean> {
    const overlappingCount = await this.prisma.booking.count({
      where: {
        talentId: talentId,
        status: { notIn: ['cancelled', 'rejected'] },
        start: { lt: newReqEnd },
        end: { gt: newReqStart },
      },
    });

    return overlappingCount > 0;
  }
}
