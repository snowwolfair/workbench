import { Component, signal, computed, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RingChartComponent } from './ring-chart/ring-chart.component';
import { CanvasDemoComponent } from './canvas-demo/canvas-demo.component';

@Component({
  selector: 'app-user',
  template: `<div class = "count1">{{count()}}</div>
            <div class = "count2">{{tencount()}}</div>
            <button [class]="buttonClasses">hello</button>
            <button (click)="increment()">up</button>`,
  styles: `.count1{
      float: left;
      text-align: center;
      width: 50%;
    }
          .count2{
      float: right;
      text-align: center;
      width: 50%;
    }` 
})
export class UserComponent {
  count = signal(0);
  tencount = (()=>{
    return this.count() * 10;
  })

  increment(){
    this.count.set(this.count() + 1);
  }

  buttonClasses = {
    highlighted: true,
  };
  
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [UserComponent, RouterOutlet, CanvasDemoComponent, RingChartComponent],
})
export class AppComponent {
  title = 'mywork';
  city = 'San franceseco';
  isLoggin = 3 > 2;

  shuxingcom = {
    shuxing2: true,
    highlighted: this.isLoggin
  }

  colorful = {
    'background-color':'yellow',
  }
}


