import { Directive, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragMove]'
})
export class DragMoveDirective {
  @Output() readonly dragStart = new EventEmitter<MouseEvent>();
  @Output() readonly dragMove = new EventEmitter<MouseEvent>();
  @Output() readonly dragEnd = new EventEmitter<MouseEvent>();

  // private destroyMouseMove: (() => void) | null = null;
  // private destroyMouseUp: (() => void) | null = null;

  private isDragging = false;

  // 监听宿主元素（即 Canvas）的按下事件
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    // 阻止默认行为（如拖动图片）和冒泡
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.dragStart.emit(event);

    // 全局禁用文本选择，提升拖拽体验
    document.body.style.userSelect = 'none';
  }

  // 监听全局 document 的移动事件，这样鼠标移出 Canvas 也能继续拖拽
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.dragMove.emit(event);
  }

  // 监听全局 document 的抬起事件
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.dragEnd.emit(event);

    // 恢复文本选择
    document.body.style.userSelect = 'auto';
  }
}
