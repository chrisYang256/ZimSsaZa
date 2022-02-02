import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] };
    // console.log('ctx.getResponse:::', response);
    // console.log('exception.getResponse err:::', err);

    response.status(status).json({
      success: false,
      path: request.url,
      statusCode: status,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
