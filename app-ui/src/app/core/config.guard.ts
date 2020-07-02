import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ButterCMSConfiguredGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const configured = !!this.apiService.writeToken;
    if (!configured) {
      this.snackbar.open('Set write-enabled token before using the app', null, {
        duration: 3000,
        panelClass: 'notification_error',
      });
      this.router.navigate(['/config'], { queryParamsHandling: 'preserve' });
    }
    return configured;
  }
}
