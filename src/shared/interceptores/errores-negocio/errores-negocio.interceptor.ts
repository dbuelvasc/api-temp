/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { ErrorNegocio } from './../../errores/errores';

@Injectable()
export class ErroresNegocioInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError(error => {
        if (error.type === ErrorNegocio.NOT_FOUND)
          throw new HttpException(error.mensaje, HttpStatus.NOT_FOUND);
        else if (error.type === ErrorNegocio.PRECONDITION_FAILED)
          throw new HttpException(error.mensaje, HttpStatus.PRECONDITION_FAILED);
        else if (error.type === ErrorNegocio.BAD_REQUEST)
          throw new HttpException(error.mensaje, HttpStatus.BAD_REQUEST);
        else
          throw error;
      }));
  }
}