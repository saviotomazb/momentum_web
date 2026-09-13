import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../interfaces/api-error.interface';
import { ErrorNotificationService } from '../services/error-notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(ErrorNotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocorreu um erro inesperado.';

      if (error.status === 0) {
        message = 'Não foi possível conectar ao servidor.';
      } else {
        const apiError = error.error as ApiError;

        if (apiError?.detail) {
          message = apiError.detail;
        }
      }

      notificationService.show(message);

      return throwError(() => error);
    }),
  );
};