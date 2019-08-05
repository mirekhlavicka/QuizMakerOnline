import { Component, ContentChild, HostListener, ElementRef, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { ViewModeDirective } from './view-mode.directive';
import { EditModeDirective } from './edit-mode.directive';
import { NgControl } from '@angular/forms';
import { fromEvent, Subject, Observable, Subscription } from 'rxjs';
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

  clickOutside$: Observable<Event> = null;
  clickOutsideSubscription: Subscription;

  @Input() mode: 'view' | 'edit' = 'view';


  constructor(private host: ElementRef) {
  }

  ngOnInit() {
    this.viewModeHandler();
    this.editModeHandler();

    if (this.mode == 'edit') {
      this.toEditMode();
    }
  }

  toViewMode() {
    if (this.mode == 'edit') {
      this.update.next();
    }
    this.mode = 'view';
    this.clickOutsideSubscription.unsubscribe();
  }

  toEditMode() {
    if (this.mode == 'edit') {
      return;
    }

    this.mode = 'edit';
    this.clickOutsideSubscription = this.clickOutside$.subscribe(event => this.toViewMode());
    setTimeout(() => {
      this.editMode.next(true);
    }, 100)
  }

  escapeEdit() {
    if (this.mode == 'edit') {
      this.escape.next();
    }
    this.mode = 'view';
    this.clickOutsideSubscription.unsubscribe();
  }

  private get element() {
    return this.host.nativeElement;
  }

  private viewModeHandler() {
    fromEvent(this.element, 'click').pipe( //dblclick
      untilDestroyed(this)
    ).subscribe(() => {
      this.toEditMode();
    });
  }

  private editModeHandler() {
    const clickOutside$ = fromEvent(document, 'click').pipe(
      filter(({ target }) => /*(target as any).parentNode &&*/ this.element.contains(target) === false ),
      take(1)
    )

    this.clickOutside$ =  this.editMode$.pipe(
      switchMapTo(clickOutside$),
      untilDestroyed(this)
    );//.subscribe(event => this.toViewMode());
  }

  get currentView() {
    return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngOnDestroy() {
  }

}
