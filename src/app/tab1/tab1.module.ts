import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Tab1Page } from './tab1.page';

@NgModule({
  imports: [CommonModule, IonicModule, Tab1PageRoutingModule, Tab1Page]
})
export class Tab1PageModule {}
