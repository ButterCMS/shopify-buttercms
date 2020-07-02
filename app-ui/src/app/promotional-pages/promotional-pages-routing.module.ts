import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotionalPagesComponent } from './promotional-pages.component';

const routes: Routes = [{ path: '', component: PromotionalPagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionalPagesRoutingModule {}
