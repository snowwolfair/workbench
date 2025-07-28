import {Directive, TemplateRef, ViewContainerRef, inject} from '@angular/core';
@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private ViewContainerRef = inject(ViewContainerRef);
}