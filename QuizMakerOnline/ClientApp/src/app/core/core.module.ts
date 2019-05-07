import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularMaterialModule } from '../shared/angular-material.module';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule } from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout';


import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';


@NgModule({
  declarations: [LoginComponent, NavComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    FlexLayoutModule
  ],
  exports: [
    NavComponent
  ]
})
export class CoreModule { }
