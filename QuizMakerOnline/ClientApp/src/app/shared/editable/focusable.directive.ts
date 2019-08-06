import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[focusable]'
})
export class FocusableDirective {

  @Input() focusDelay: number = 100;

  constructor(private host: ElementRef) { }

  ngAfterViewInit() {
    setTimeout(() => { this.host.nativeElement.focus(); }, this.focusDelay);    
  }
}
