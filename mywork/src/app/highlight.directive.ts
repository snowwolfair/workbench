import { Directive, ElementRef, inject, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective{
  private el = inject(ElementRef);

  @Input() appHighlight = '';
  @Input() defaultColor = '';

  @HostListener('mouseenter') onMouseEnter(){
    this.highlight(this.appHighlight || this.defaultColor || 'red');
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.highlight('');
  }

  private highlight(color: string){
    this.el.nativeElement.style.backgroundColor = color;
  }
}
