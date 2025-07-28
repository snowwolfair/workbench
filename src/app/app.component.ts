import { Component, signal, computed, OnInit, ViewChild, ViewContainerRef, inject, HostListener, HostBinding, output} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


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
  imports: [UserComponent, RouterOutlet, RouterLink, RouterLinkActive],
})
export class AppComponent {
  title = 'mywork';
  city = 'San franceseco';
  color = '';


  @HostBinding('style.color') bgcolor = 'black';
  
  toColor(){
    this.bgcolor = this.bgcolor === 'black' ? "pink" : 'black';
  }

  @HostListener('click', ['$event'])
  changeColor(event: Event){

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    console.log('窗口滚动了', window.scrollY);
  }

  colorful = {
    'background-color':'yellow',
  }
}


