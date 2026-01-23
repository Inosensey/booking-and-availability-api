// guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies?.token as string;

    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }

    try {
      const secret = process.env.JWT_SECRET || 'your-fallback-secret';
      const decoded = jwt.verify(token, secret) as {
        userId: string;
        roleType: string;
      };

      (request as any).user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
