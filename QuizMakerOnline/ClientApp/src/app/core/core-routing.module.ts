import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';

const routes: Routes = [/*{ path: 'login', component: LoginComponent }*/
  {
    //path: 'login', component: NavComponent, children: [
    //  {
    //    path: '',
    //    component: LoginComponent
    //  }]
    path: 'login', component: LoginComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
