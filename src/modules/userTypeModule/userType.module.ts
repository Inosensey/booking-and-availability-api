// userType.module.ts
import { Module } from '@nestjs/common';
import { UserTypeController } from './userType.controller';
import { UserTypeService } from './userType.service';

@Module({
  controllers: [UserTypeController],
  providers: [UserTypeService],
  exports: [UserTypeService],
})
export class UserTypeModule {}
