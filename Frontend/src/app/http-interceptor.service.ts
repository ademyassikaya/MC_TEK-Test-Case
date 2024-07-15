import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Modify the request to include credentials
    request = request.clone({
      withCredentials: true, // send cookies with the request
    });

    // Optionally, you can set headers for CORS if needed
    // request = request.clone({
    //   setHeaders: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${yourAuthToken}`, // if using tokens
    //   },
    // });

    return next.handle(request);
  }
}
