import { Directive, Input, HostListener } from '@angular/core';
import { EditableComponent } from './editable.component';

@Directive({
  selector: '[editableOnEnter]'
})
export class EditableOnEnterDirective {
  constructor(private editable: EditableComponent) {
  }

  @HostListener('keyup.enter')
  onEnter() {
    this.editable.toViewMode();
  }

  @HostListener('keyup.escape')
  onEscape() {
    this.editable.escapeEdit();
  }
}
