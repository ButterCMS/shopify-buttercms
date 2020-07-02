import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { PromotionalPage } from '../types';
import { TemplateDialogComponent } from './template-dialog/template-dialog.component';

@Component({
  selector: 'app-promotional-pages',
  templateUrl: './promotional-pages.component.html',
  styleUrls: ['./promotional-pages.component.scss'],
})
export class PromotionalPagesComponent implements OnInit {
  pages: Observable<{
    meta: {
      next_page: number | null;
      previous_page: number | null;
      count: number;
    };
    data: PromotionalPage[];
  }>;
  displayedColumns = ['image', 'title', 'description', 'actions'];
  errorMessage: string;

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.pages = this.apiService.getPromotionalPages(1).pipe(
      catchError((error) => {
        console.log(error);
        this.errorMessage =
          error.message && error.error.message
            ? error.error.message
            : error.message;
        return throwError(error);
      })
    );
  }

  createPage(page: PromotionalPage) {
    this.dialog.open(TemplateDialogComponent, {
      width: '800px',
      maxWidth: '80%',
      data: { slug: page.slug },
    });
  }
}
