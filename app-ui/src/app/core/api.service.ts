import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromotionalPage } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'app';
  writeToken: string;

  constructor(private http: HttpClient) {}

  configApp(config: { butterCMSWriteToken: string }): Observable<void> {
    this.writeToken = config.butterCMSWriteToken;
    return this.http.post<void>(`${this.apiUrl}/butter-cms/config`, {
      config,
    });
  }

  getPromotionalPages(
    pageNumber: number
  ): Observable<{
    meta: {
      next_page: number | null;
      previous_page: number | null;
      count: number;
    };
    data: PromotionalPage[];
  }> {
    return this.http.get<{
      meta: {
        next_page: number | null;
        previous_page: number | null;
        count: number;
      };
      data: PromotionalPage[];
    }>(`${this.apiUrl}/butter-cms/promotional-pages/page/${pageNumber}`);
  }

  createPageFromButterCMSPage(
    slug: string,
    template: string
  ): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/butter-cms/promotional-page/`, {
      slug,
      template,
    });
  }
}
