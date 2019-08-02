import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { EditableComponent } from './editable/editable.component';
import { ViewModeDirective } from './editable/view-mode.directive';
import { EditModeDirective } from './editable/edit-mode.directive';
import { FocusableDirective } from './editable/focusable.directive';
import { EditableOnEnterDirective } from './editable/editable-on-enter.directive';

@NgModule({
  declarations: [
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    FocusableDirective,
    EditableOnEnterDirective
    ],
  imports: [
    CommonModule
  ],
  exports: [
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    FocusableDirective,
    EditableOnEnterDirective
  ]
})
export class EditableModule { }
