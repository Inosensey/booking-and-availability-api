import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'Talend Booking Management API',
      status: 'running',
      version: '1.0.0',
      description:
        'A backend API for managing bookings, schedules, and related business logic.',
      docs: 'https://github.com/Inosensey/booking-and-availability-api#api-documentation',
      timestamp: new Date().toISOString(),
    };
  }
}
