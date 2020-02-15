import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockingPageRoutingModule } from './clocking-routing.module';

import { ClockingPage } from './clocking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockingPageRoutingModule
  ],
  declarations: [ClockingPage]
})
export class ClockingPageModule {}
