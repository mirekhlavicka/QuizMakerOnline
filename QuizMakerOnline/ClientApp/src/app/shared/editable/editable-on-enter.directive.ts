import { Directive, Input, HostListener } from '@angular/core';
import { EditableComponent } from './editable.component';

@Directive({
  selector: '[editableOnEnter]'
})
export class EditableOnEnterDirective {
  constructor(private editable: EditableComponent) {
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterDown(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  @HostListener('keyup.enter', ['$event'])
  onEnter(e: any) {
    this.editable.toViewMode();
  }

  @HostListener('keyup.escape')
  onEscape() {
    this.editable.escapeEdit();
  }
}
