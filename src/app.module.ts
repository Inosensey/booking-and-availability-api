import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './prisma/prisma.module';
import { UserModule } from './modules/usersModule/users.module';
import { UserTypeModule } from './modules/userTypeModule/userType.module';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permission.guard';
import { TalentModule } from './modules/talentsModule/talents.module';
import { BookingModule } from './modules/bookingsModule/bookings.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    UserTypeModule,
    TalentModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard, PermissionsGuard],
  exports: [AuthGuard, PermissionsGuard],
})
export class AppModule {}
