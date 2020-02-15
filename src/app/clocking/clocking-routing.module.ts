import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockingPage } from './clocking.page';

const routes: Routes = [
  {
    path: '',
    component: ClockingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockingPageRoutingModule {}
