import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ring-chart',
  template: `<canvas #canvas width="150" height="150"
    (mousemove)="onMouseMove($event)"
    (mouseleave)="onMouseLeave()"></canvas>
    @if(hoverIndex !== null){
      <div class="center-label"
      [style.left.px]="centerX - 20"
      [style.top.px]="centerY - 12">
      {{ hoverIndex !== null ? validData[hoverIndex] : '' }}
      </div>
    }`,
  styleUrls: ['./ring-chart.component.css']
})
export class RingChartComponent implements AfterViewInit, OnChanges {

  @Input() data: number[] = [1]; // 任意长度
  @Input() colors: string[] = [
    '#6ea966', '#f6c542', '#5a6edb', '#e57373', '#64b5f6',
    '#81c784', '#ffd54f', '#ba68c8', '#4db6ac', '#ff8a65'
  ];
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  hoverIndex: number | null = null;
  centerX = 75;
  centerY = 75;
  validData: number[] = [1];
  radius = 60;
  hoverRadius = 66;
  animationSpeed = 0.2; // 越大越快
  currentRadii: number[] = [];
  targetRadii: number[] = [];
  animationFrameId: number | null = null;
  defaultRingWidth = 18;
  hoverRingWidth = 30;
  currentWidths: number[] = [];
  targetWidths: number[] = [];

  ngAfterViewInit() {
    this.validData = (this.data && this.data.length > 0) ? this.data : [1];
    this.adjustRadiusAndWidth();
    this.currentRadii = this.validData.map(() => this.radius);
    this.targetRadii = this.validData.map(() => this.radius);
    this.currentWidths = this.validData.map(() => this.defaultRingWidth);
    this.targetWidths = this.validData.map(() => this.defaultRingWidth);
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.validData = (this.data && this.data.length > 0) ? this.data : [1];
    this.adjustRadiusAndWidth();
    this.currentRadii = this.validData.map(() => this.radius);
    this.targetRadii = this.validData.map(() => this.radius);
    this.currentWidths = this.validData.map(() => this.defaultRingWidth);
    this.targetWidths = this.validData.map(() => this.defaultRingWidth);
    this.drawChart();
  }

  /**
   * 动态调整半径和宽度，保证不会超出canvas
   */
  adjustRadiusAndWidth() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const maxWidth = Math.max(this.defaultRingWidth, this.hoverRingWidth);
    // 预留2px边距
    const maxRadius = (Math.min(canvas.width, canvas.height) / 2) - maxWidth / 2 - 2;
    this.radius = maxRadius - (this.hoverRadius - this.radius); // 保证放大后也不超
    this.hoverRadius = maxRadius;
  }

  /**
   * 鼠标移动事件，判断悬停在哪一段
   */
  onMouseMove(event: MouseEvent) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = x - this.centerX;
    const dy = y - this.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 判断是否在圆环范围内
    if (distance < 51 || distance > 69) {
      if (this.hoverIndex !== null) {
        this.hoverIndex = null;
        this.setTargetStates(null);
        this.animate();
      }
      return;
    }

    // 计算角度
    let angle = Math.atan2(dy, dx);
    if (angle < -Math.PI / 2) angle += 2 * Math.PI;
    angle += Math.PI / 2;

    // 找到悬停的 segment
    const total = this.validData.reduce((sum, val) => sum + val, 0);
    let start = 0;
    for (let i = 0; i < this.validData.length; i++) {
      const segAngle = (this.validData[i] / total) * Math.PI * 2;
      if (angle >= start && angle < start + segAngle) {
        if (this.hoverIndex !== i) {
          this.hoverIndex = i;
          this.setTargetStates(i);
          this.animate();
        }
        return;
      }
      start += segAngle;
    }
    if (this.hoverIndex !== null) {
      this.hoverIndex = null;
      this.setTargetStates(null);
      this.animate();
    }
  }

  /**
   * 鼠标移出事件
   */
  onMouseLeave() {
    this.hoverIndex = null;
    this.setTargetStates(null);
    this.animate();
  }

  /**
   * 绘制圆环图
   */
  drawChart() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = this.validData.reduce((sum, val) => sum + val, 0);
    let startAngle = -Math.PI / 2;

    this.validData.forEach((value, idx) => {
      const angle = (value / total) * Math.PI * 2;
      ctx.beginPath();
      const r = this.currentRadii[idx] || this.radius;
      const w = this.currentWidths[idx] || this.defaultRingWidth;
      ctx.arc(this.centerX, this.centerY, r, startAngle, startAngle + angle, false);
      ctx.strokeStyle = this.colors[idx % this.colors.length];
      ctx.lineWidth = w;
      ctx.lineCap = 'butt';
      ctx.stroke();
      startAngle += angle;
    });

    if (this.hoverIndex !== null) {
      ctx.save();
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.validData[this.hoverIndex].toString(), this.centerX, this.centerY);
      ctx.restore();
    }
  }

  setTargetStates(hoverIdx: number | null) {
    this.targetRadii = this.validData.map((_, idx) =>
      hoverIdx === idx ? this.hoverRadius : this.radius
    );
    this.targetWidths = this.validData.map((_, idx) =>
      hoverIdx === idx ? this.hoverRingWidth : this.defaultRingWidth
    );
  }

  animate() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    const animateStep = () => {
      let needNextFrame = false;
      for (let i = 0; i < this.currentRadii.length; i++) {
        // 半径动画
        const diffR = this.targetRadii[i] - this.currentRadii[i];
        if (Math.abs(diffR) > 0.5) {
          this.currentRadii[i] += diffR * this.animationSpeed;
          needNextFrame = true;
        } else {
          this.currentRadii[i] = this.targetRadii[i];
        }
        // 宽度动画
        const diffW = this.targetWidths[i] - this.currentWidths[i];
        if (Math.abs(diffW) > 0.5) {
          this.currentWidths[i] += diffW * this.animationSpeed;
          needNextFrame = true;
        } else {
          this.currentWidths[i] = this.targetWidths[i];
        }
      }
      this.drawChart();
      if (needNextFrame) {
        this.animationFrameId = requestAnimationFrame(animateStep);
      } else {
        this.animationFrameId = null;
      }
    };
    animateStep();
  }
}