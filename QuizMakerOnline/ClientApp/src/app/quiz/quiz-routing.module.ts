import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from '../core/nav/nav.component';
import { QuestionsComponent } from './questions/questions.component';
import { TestComponent } from './test/test.component';
import { TestPrintComponent } from './test-print/test-print.component';
import { AuthGuard } from '../core/auth.guard'

const routes: Routes = [
  //{
  //  path: 'questions/:id_course', component: NavComponent, children: [
  //    {
  //      path: '',
  //      component: QuestionsComponent,
  //      canActivate: [AuthGuard]
  //    }]
  //},
  //{
  //  path: 'test', component: NavComponent, children: [
  //    {
  //      path: '',
  //      component: TestComponent,
  //      canActivate: [AuthGuard]
  //    }]
  //}
  {
    path: 'questions/:id_course', component: QuestionsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'test', component: TestComponent, canActivate: [AuthGuard]
  },
  {
    path: 'printtest', outlet: 'print', component: TestPrintComponent, canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
