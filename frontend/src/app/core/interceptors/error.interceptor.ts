import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError(err => {
      const message = err.error?.error ?? err.error?.[0] ?? 'Erro inesperado.';
      if (err.status === 401) {
        router.navigate(['/login']);
        snackBar.open('Sessão expirada. Faça login novamente.', 'Fechar', { duration: 4000 });
      } else if (err.status === 404) {
        snackBar.open('Recurso não encontrado.', 'Fechar', { duration: 3000 });
      } else {
        snackBar.open(message, 'Fechar', { duration: 4000, panelClass: 'snack-error' });
      }
      return throwError(() => err);
    })
  );
};