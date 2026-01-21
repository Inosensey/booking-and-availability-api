import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './bookings.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { ApiResponse } from 'src/utils/responseShaper';
import {
  CreateBookingDTO,
  RescheduleBookingDto,
  UpdateStatusBookingDto,
} from './bookings.dto';

@Controller('Bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Get('/:talentId')
  async getTalentBookings(@Param('talentId') talentId: string) {
    const results = await this.bookingService.getTalentBookings(talentId);
    return ApiResponse.success(results, 'Bookings retrieved successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Get('/id')
  async getBookingById(@Param('id') id: string) {
    const results = await this.bookingService.getTalentBookingById(id);
    return ApiResponse.success(results, 'Bookings retrieved successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Post('/request')
  async requestBooking(@Body() data: CreateBookingDTO) {
    const result = await this.bookingService.requestBooking(data);
    return ApiResponse.success(result, 'Booking created successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Put('/update/:id')
  async updateBooking(
    @Param('id') id: string,
    @Body() data: UpdateStatusBookingDto,
  ) {
    const result = await this.bookingService.updateBooking(
      data.action as 'accept' | 'reject',
      id,
    );
    return ApiResponse.success(result, `Booking ${data.action}ed successfully`);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Put('/reschedule/:id')
  async rescheduleBooking(
    @Param('id') id: string,
    @Body() data: RescheduleBookingDto,
  ) {
    const result = await this.bookingService.rescheduleBooking(id, data);
    return ApiResponse.success(result, 'Booking rescheduled successfully');
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Put('/cancel/:id')
  async cancelBooking(@Param('id') id: string) {
    const result = await this.bookingService.cancelBooking(id);
    return ApiResponse.success(result, 'Booking canceled successfully');
  }
}
