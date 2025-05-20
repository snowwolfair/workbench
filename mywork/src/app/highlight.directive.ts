import { Directive, ElementRef, inject, HostListener} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective{
  private el = inject(ElementRef);

  @HostListener('mouseenter') onMouseEnter(){
    this.highlight('yellow');
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.highlight('');
  }

  private highlight(color: string){
    this.el.nativeElement.style.backgroundColor = color;
  }
}
