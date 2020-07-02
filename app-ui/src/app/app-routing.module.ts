import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigFormComponent } from './config/config-form/config-form.component';
import { ButterCMSConfiguredGuard } from './core/config.guard';

const routes: Routes = [
  { path: 'config', component: ConfigFormComponent },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'config',
  },
  {
    path: 'promotional-pages',
    loadChildren: () =>
      import('./promotional-pages/promotional-pages.module').then(
        (m) => m.PromotionalPagesModule
      ),
    canActivate: [ButterCMSConfiguredGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
