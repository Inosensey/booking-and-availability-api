import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const target = Array.isArray(exception.meta?.target)
          ? exception.meta?.target.join(', ')
          : 'Field';
        return response.status(409).json({
          success: false,
          message: `${target} already exists`,
        });
      }

      case 'P2025':
        return response.status(404).json({
          success: false,
          message: 'Record not found',
        });

      default:
        return response.status(500).json({
          success: false,
          message: 'Database error',
        });
    }
  }
}
