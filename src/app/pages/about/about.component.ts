import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ViewportRuler } from '@angular/cdk/overlay';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.less'
})
export class AboutComponent {
  constructor(private ViewportRuler: ViewportRuler) {}
  ngOnInit() {
    console.log(this.ViewportRuler.getViewportScrollPosition);
  }

  showOverlay = false;

  // 可选：用于判断点击是否发生在 special-panel 内（如果你允许点击蒙层外关闭）
  @ViewChild('specialPanel', { static: false }) specialPanel!: ElementRef;

  onOverlayClick(event: MouseEvent) {
    // 可选逻辑：如果点击不在 special-panel 上，才关闭？或完全禁止关闭？
    // 默认：点击蒙层不关闭（因为你说“必须点 div 内按钮才关闭”）
    // 所以这里可以留空，或阻止默认行为
    // event.stopPropagation();
    this.showOverlay = false; // ❌ 不要自动关闭
  }
}
