import { Component, ContentChild, HostListener, ElementRef, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { ViewModeDirective } from './view-mode.directive';
import { EditModeDirective } from './edit-mode.directive';
import { NgControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, filter, take, switchMapTo } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'editable',
  template: `
    <ng-container *ngTemplateOutlet="currentView"></ng-container>
  `,
  styleUrls: ['./editable.component.css']
})
export class EditableComponent {
  @ContentChild(ViewModeDirective) viewModeTpl: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl: EditModeDirective;
  @Output() update = new EventEmitter();
  @Output() escape = new EventEmitter();

  editMode = new Subject();
  editMode$ = this.editMode.asObservable();

  @Input() mode: 'view' | 'edit' = 'view';


  constructor(private host: ElementRef) {
  }

  ngOnInit() {
    this.viewModeHandler();
    this.editModeHandler();

    if (this.mode == 'edit') {

      setTimeout(() => {
        this.editMode.next(true);
      }, 100)

    }
  }

  toViewMode() {
    this.update.next();
    this.mode = 'view';
  }

  escapeEdit() {
    this.escape.next();
    this.mode = 'view';
  }

  private get element() {
    return this.host.nativeElement;
  }

  private viewModeHandler() {
    fromEvent(this.element, 'click').pipe( //dblclick
      untilDestroyed(this)
    ).subscribe(() => { 
      this.mode = 'edit';
      this.editMode.next(true);
    });
  }

  private editModeHandler() {
    const clickOutside$ = fromEvent(document, 'click').pipe(
      filter(({ target }) => this.element.contains(target) === false),
      take(1)
    )

    this.editMode$.pipe(
      switchMapTo(clickOutside$),
      untilDestroyed(this)
    ).subscribe(event => this.toViewMode());
  }

  get currentView() {
    return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngOnDestroy() {
  }

}
