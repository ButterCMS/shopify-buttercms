import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class UrlQueryInterceptor implements HttpInterceptor {
  constructor(private route: ActivatedRoute) {}

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    const params = this.route.snapshot.queryParams;
    const queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    const req = request.clone({
      url:
        request.url.indexOf('?') > -1
          ? `${request.url}&${queryString}`
          : `${request.url}?${queryString}`,
    });
    return next.handle(req);
  }
}
