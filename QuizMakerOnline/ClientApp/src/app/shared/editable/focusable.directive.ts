import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[focusable]'
})
export class FocusableDirective {

  constructor(private host: ElementRef) { }

  ngAfterViewInit() {

    setTimeout(() => { this.host.nativeElement.focus();  }, 100);

    
  }

}
