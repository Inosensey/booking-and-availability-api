// userType.module.ts
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserTypeController } from './userType.controller';
import { UserTypeService } from './userType.service';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
  controllers: [UserTypeController],
  providers: [UserTypeService],
  exports: [UserTypeService],
})
export class UserTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'roles', method: RequestMethod.GET });
  }
}
