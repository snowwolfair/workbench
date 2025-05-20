import { Component, ViewChild, ElementRef, AfterViewInit, Injectable} from '@angular/core';

@Component({
  selector: 'app-canvas-demo',
  templateUrl: './canvas-demo.component.html',
  styleUrls: ['./canvas-demo.component.css']
})
export class CanvasDemoComponent implements AfterViewInit {
  // 通过 ViewChild 获取 canvas 元素
  @ViewChild('tutorial') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {
    const canvas = this.canvasRef.nativeElement;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 示例：绘制一个矩形
        ctx.fillStyle = 'blue';
        ctx.fillRect(10, 10, 100, 100);
      }
    }
  }
}

@Injectable({providedIn:'root'})
export class Calculator{
  adds(x: number,y: number, z:number){
    return x + y + z;
  }
}

