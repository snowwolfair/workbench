import { Component, signal, computed, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {} from '@angular/core';
import { CanvasDemoComponent } from './canvas-demo/canvas-demo.component';

const firstName = signal('Morgan');
console.log(firstName());
firstName.set('Jaime');
console.log(firstName());
firstName.update(name => name.toUpperCase());
console.log(firstName());

@Component({
  selector: 'app-user',
  template: `<div class = "count1">{{count()}}</div>
            <div class = "count2">{{tencount()}}</div>
            <button [class]="buttonClasses">hello</button>
            <button (click)="increment()">up</button>`,
  styles: `.count1{
      float: left;
      width: 50%;
    }
          .count2{
      float: right;
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
    embiggened: false,
  };
  
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [UserComponent, RouterOutlet, CanvasDemoComponent],
})
export class AppComponent {
  title = 'mywork';
  city = 'San franceseco';
  isLoggin = 1 > 2;
}


