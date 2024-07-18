import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true,
    });

    // request = request.clone({
    //   setHeaders: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${yourAuthToken}`,
    //   },
    // });

    return next.handle(request);
  }
}
