import { ViewportRuler } from '@angular/cdk/overlay';
import { Component, ViewChild, ElementRef, inject, OnInit, HostListener, AfterViewInit } from '@angular/core';

import { DragMoveDirective } from '../../directive/drag-move.directive';

interface DataColor {
  color: string;
  r: number;
  g: number;
  b: number;
}

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-about',
  imports: [DragMoveDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.less'
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('colorbar', { static: false }) colorbar!: ElementRef;
  @ViewChild('colorpanel', { static: false }) colorpanel!: ElementRef;
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log(event);
    console.log(this.selectedColor);
  }

  private ViewportRuler = inject(ViewportRuler);
  ngOnInit() {
    console.log(this.ViewportRuler.getViewportScrollPosition());
  }

  colorbarCanvas!: HTMLCanvasElement;
  colorpanelCanvas!: HTMLCanvasElement;
  ngAfterViewInit(): void {
    this.colorbarCanvas = this.colorbar.nativeElement as HTMLCanvasElement;
    this.createBar(this.colorbarCanvas);
    this.hueCursorX = this.colorbarCanvas.width - 10;

    this.colorpanelCanvas = this.colorpanel.nativeElement as HTMLCanvasElement;
    this.createPanel(this.colorpanelCanvas);
    this.panelCursor = { x: this.colorpanelCanvas.width - 8, y: 8 };
  }

  showOverlay = false;

  // 可选：用于判断点击是否发生在 special-panel 内（如果你允许点击蒙层外关闭）
  @ViewChild('specialPanel', { static: false }) specialPanel!: ElementRef;

  onOverlayClick(event: MouseEvent) {
    let h = event;
    if (h) {
      console.log('点击了蒙层');
    }
    this.showOverlay = false; // ❌ 不要自动关闭
  }

  barImgData!: ImageDataArray;
  panelImgData!: ImageDataArray;
  panelWidthPx = 0;

  bgColor = '#ff0000'; // 初始背景色（红色）
  selectedColor = '#ff0000';

  huelist = [
    'hsl(60deg, 100%, 50%)',
    'hsl(120deg, 100%, 50%)',
    'hsl(180deg, 100%, 50%)',
    'hsl(240deg, 100%, 50%)',
    'hsl(300deg, 100%, 50%)'
  ];

  // --- 原有逻辑改造 ---

  createBar(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
    const len = this.huelist.length + 1;
    grd.addColorStop(0.01, 'hsl(0deg, 100%, 50%)');
    this.huelist.forEach((a, i) => {
      grd.addColorStop((i + 1) / len, a);
    });
    grd.addColorStop(0.99, 'hsl(360deg, 100%, 50%)');

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 获取色相条数据
    this.barImgData = ctx.getImageData(0, 0, canvas.width, 1).data;
  }

  createPanel(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 1. 填充基础色
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. 白色水平渐变
    const grdW = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grdW.addColorStop(0, 'white');
    grdW.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grdW;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. 黑色垂直渐变
    const grdB = ctx.createLinearGradient(0, canvas.height, 0, 0);
    grdB.addColorStop(0, 'black');
    grdB.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grdB;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.panelImgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    this.panelWidthPx = canvas.width * 4;
  }

  // --- 交互逻辑 ---

  panelCursor: Point = { x: 8, y: 8 };
  hueCursorX = 10;

  barRadius = 10;
  // 拖动色相条：改变面板的基础色
  onHueMove(e: MouseEvent) {
    const rect = this.colorbarCanvas.getBoundingClientRect();

    let x = Math.floor(e.clientX - rect.left);
    x = Math.max(0, Math.min(x, rect.width - 1));

    this.hueCursorX = Math.max(this.barRadius, Math.min(x, this.colorbarCanvas.width - this.barRadius));
    console.log(this.hueCursorX);

    const index = x * 4;
    const res = this.getPixelColor(this.barImgData, index);
    if (res) {
      this.bgColor = res.color;
      console.log(this.bgColor);
      this.createPanel(this.colorpanel.nativeElement); // 重新渲染面板

      // 更新最终颜色
      console.log(this.panelCursor);
      const point = this.panelCursor.x * 4 + this.panelCursor.y * this.panelWidthPx;
      if (this.getPixelColor(this.panelImgData, point)) {
        this.selectedColor = this.getPixelColor(this.panelImgData, point).color;
        this.fixEdgeAdsorption();
        if (this.panelCursor.x === this.colorpanelCanvas.width - this.panelRadius && this.panelCursor.y === this.panelRadius) {
          this.selectedColor = this.bgColor;
        }
      }
    }
  }

  panelRadius = 8;
  // 拖动面板：选择最终颜色
  onPanelMove(e: MouseEvent) {
    const rect = this.colorpanelCanvas.getBoundingClientRect();
    let x = Math.floor(e.clientX - rect.left);
    let y = Math.floor(e.clientY - rect.top);

    x = Math.max(0, Math.min(x, rect.width - 1));
    y = Math.max(0, Math.min(y, rect.height - 1));

    const threshold = 2; // 距离边缘 2px 以内触发强制吸附

    if (x <= threshold) x = 0;
    if (x >= this.colorpanelCanvas.width - threshold) x = this.colorpanelCanvas.width - 1;
    if (y <= threshold) y = 0;
    if (y >= this.colorpanelCanvas.height - threshold) y = this.colorpanelCanvas.height - 1;

    console.log(x, y);

    this.panelCursor = {
      x: Math.max(this.panelRadius, Math.min(x, this.colorpanelCanvas.width - this.panelRadius)),
      y: Math.max(this.panelRadius, Math.min(y, this.colorpanelCanvas.height - this.panelRadius))
    };
    console.log(this.panelCursor);

    // 这里的索引计算：(行坐标 * 每行字节数) + (列坐标 * 4)
    const index = y * this.panelWidthPx + x * 4;
    const res = this.getPixelColor(this.panelImgData, index);
    if (res) {
      this.selectedColor = res.color;
      if (x === 0 && y === 0) this.selectedColor = '#ffffff'; // 左上角纯白
      if (y >= this.colorpanelCanvas.height - this.panelRadius) this.selectedColor = '#000000'; // 底部纯黑
    }
  }

  private getPixelColor(imgData: ImageDataArray, i: number): DataColor | undefined {
    i = Math.floor(i / 4) * 4;
    if (i >= 0 && i <= imgData.length - 3) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      // const hexcolor = { color: this.rgbToHex(r, g, b), r, g, b };
      const rgbcolor = { color: `rgb(${r},${g},${b})`, r, g, b };
      return rgbcolor;
    }
    return undefined;
  }

  rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  fixEdgeAdsorption() {
    if (this.panelCursor.x === this.panelRadius && this.panelCursor.y === this.panelRadius) this.selectedColor = '#ffffff';
    if (this.panelCursor.y === this.colorpanelCanvas.height - this.panelRadius) this.selectedColor = '#000000';
  }

  updateCursorsByHSV(h: number, s: number, v: number) {
    // 1. 定位色相条指针 (Hue)
    // 比例：H / 360 = x / width
    const hueCanvas = this.colorbar.nativeElement;
    this.hueCursorX = (h / 360) * hueCanvas.width;

    // 2. 更新面板背景色 (因为 H 变了)
    // 需要先获取 H 对应的纯色 RGB
    const baseRgb = this.hsvToRgb(h, 100, 100);
    this.bgColor = `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`;
    this.createPanel(this.colorpanel.nativeElement);

    // 3. 定位面板指针 (Saturation & Value)
    // S 对应 X 轴 (从左往右 0-100%)，但在你的面板逻辑中，左侧是白(S=0)，右侧是纯色(S=100)
    // V 对应 Y 轴 (从下往上 0-100%)，但在 Canvas 坐标系中，顶部 y=0 是 V=100，底部 y=height 是 V=0
    const panelCanvas = this.colorpanel.nativeElement;
    this.panelCursor.x = (s / 100) * panelCanvas.width;
    this.panelCursor.y = (1 - v / 100) * panelCanvas.height;

    // 4. 更新最终选择的颜色
    const finalRgb = this.hsvToRgb(h, s, v);
    this.selectedColor = `rgb(${finalRgb.r}, ${finalRgb.g}, ${finalRgb.b})`;
  }

  // 辅助函数：HSV 转 RGB (用于设置面板背景色)
  hsvToRgb(h: number, s: number, v: number) {
    s /= 100;
    v /= 100;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r = 0,
      g = 0,
      b = 0;
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
}
