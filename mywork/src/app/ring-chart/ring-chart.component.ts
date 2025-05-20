import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ring-chart',
  template: `<canvas #canvas width="150" height="150"
    (mousemove)="onMouseMove($event)"
    (mouseleave)="onMouseLeave()"></canvas>
    <div class="center-label" *ngIf="hoverIndex !== null"
      [style.left.px]="centerX - 20"
      [style.top.px]="centerY - 12">
      {{ hoverIndex !== null ? validData[hoverIndex] : '' }}
    </div>`,
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

  ngAfterViewInit() {
    this.validData = (this.data && this.data.length > 0) ? this.data : [1];
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.validData = (this.data && this.data.length > 0) ? this.data : [1];
    this.drawChart();
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
        this.drawChart();
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
          this.drawChart();
        }
        return;
      }
      start += segAngle;
    }
    if (this.hoverIndex !== null) {
      this.hoverIndex = null;
      this.drawChart();
    }
  }

  /**
   * 鼠标移出事件
   */
  onMouseLeave() {
    this.hoverIndex = null;
    this.drawChart();
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
    const radius = 60;
    const ringWidth = 18;
    let startAngle = -Math.PI / 2;

    this.validData.forEach((value, idx) => {
      const angle = (value / total) * Math.PI * 2;
      ctx.beginPath();
      const r = (this.hoverIndex === idx) ? radius + 6 : radius;
      ctx.arc(this.centerX, this.centerY, r, startAngle, startAngle + angle, false);
      // 颜色循环
      ctx.strokeStyle = this.colors[idx % this.colors.length];
      ctx.lineWidth = ringWidth;
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
}