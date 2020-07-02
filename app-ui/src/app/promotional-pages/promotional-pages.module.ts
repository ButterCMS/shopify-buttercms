import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTMLEscapeUnescapeModule } from 'html-escape-unescape';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PromotionalPagesRoutingModule } from './promotional-pages-routing.module';
import { PromotionalPagesComponent } from './promotional-pages.component';
import { TemplateDialogComponent } from './template-dialog/template-dialog.component';
import { TemplateDialogFormComponent } from './template-dialog-form/template-dialog-form.component';

@NgModule({
  declarations: [
    PromotionalPagesComponent,
    TemplateDialogComponent,
    TemplateDialogFormComponent,
  ],
  imports: [
    CommonModule,
    PromotionalPagesRoutingModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ClipboardModule,
    HTMLEscapeUnescapeModule,
    MatSnackBarModule,
  ],
  entryComponents: [TemplateDialogComponent],
})
export class PromotionalPagesModule {}
