import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import localeCs from '@angular/common/locales/cs';
registerLocaleData(localeCs);

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { EditableModule } from '../shared/editable.module';
import { FormsModule } from '@angular/forms'

import { FlexLayoutModule } from '@angular/flex-layout';

import { QuizRoutingModule } from './quiz-routing.module';

import { QuestionsComponent } from './questions/questions.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { MathjaxComponent } from './mathjax/mathjax.component';
import { MathjaxEditComponent } from './mathjax-edit/mathjax-edit.component';
import { TestPrintComponent } from './test-print/test-print.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { TestsComponent } from './tests/tests.component';
import { TestDetailComponent } from './test-detail/test-detail.component';
import { TestEditComponent } from './test-edit/test-edit.component';
import { CategoriesComponent } from './categories/categories.component';
import { QuestionHistoryComponent } from './question-history/question-history.component';
import { CourseRightsComponent } from './course-rights/course-rights.component';
import { SelectImageComponent } from './select-image/select-image.component';




//import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    QuestionsComponent,
    QuestionDetailComponent,
    MathjaxComponent,
    MathjaxEditComponent,
    TestPrintComponent,
    TestsComponent,
    TestDetailComponent,
    TestEditComponent,
    CategoriesComponent,
    QuestionHistoryComponent,
    CourseRightsComponent,
    SelectImageComponent],
  imports: [
    CommonModule,
    QuizRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    EditableModule,
    FormsModule,
    FlexLayoutModule,
    //ReactiveFormsModule
    CodemirrorModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "cs-CZ" }, //replace "en-US" with your locale
    //otherProviders...
  ],
  entryComponents: [
    MathjaxEditComponent,
    TestEditComponent,
    SelectImageComponent
  ],
})
export class QuizModule { }
