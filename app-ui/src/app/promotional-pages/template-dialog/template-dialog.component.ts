import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/api.service';

@Component({
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss'],
})
export class TemplateDialogComponent implements OnInit {
  errorMessage: string;
  isSubmitting = false;

  constructor(
    private dialogRef: MatDialogRef<TemplateDialogComponent>,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) private pageData: { slug: string }
  ) {}
  ngOnInit() {}

  onSubmitForm(template: string) {
    this.errorMessage = '';
    this.isSubmitting = true;
    this.apiService
      .createPageFromButterCMSPage(this.pageData.slug, template)
      .subscribe(
        (res) => {
          this.isSubmitting = false;
          this.dialogRef.close();
          this.snackBar.open(
            'Page was successfully created. Check your shop pages.',
            null,
            { duration: 3000, panelClass: 'notification_success' }
          );
        },
        (error) => {
          this.errorMessage =
            error.error && error.error.message
              ? error.error.message
              : error.statusText;
          this.isSubmitting = false;
          console.log(error);
        }
      );
  }
}
