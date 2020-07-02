import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.scss'],
})
export class ConfigFormComponent implements OnInit {
  form: FormGroup;
  submittingForm = false;
  errorMessage: string;
  tokenLength = 40;

  constructor(private apiService: ApiService, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      butterCMSWriteToken: new FormControl(this.apiService.writeToken || '', [
        Validators.required,
        Validators.minLength(this.tokenLength),
        Validators.maxLength(this.tokenLength),
      ]),
    });
  }

  get butterCMSWriteToken() {
    return this.form.get('butterCMSWriteToken');
  }

  submitForm() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.submittingForm = true;
    this.errorMessage = '';
    this.apiService.configApp(this.form.value).subscribe(
      () => {
        this.snackbar.open('Token has been saved', null, {
          duration: 3000,
          panelClass: 'notification_success',
        });
        this.submittingForm = false;
      },
      (error) => {
        console.log(error);
        this.submittingForm = false;
        this.errorMessage =
          error.message && error.error.message
            ? error.error.message
            : error.message;
      }
    );
  }
}
