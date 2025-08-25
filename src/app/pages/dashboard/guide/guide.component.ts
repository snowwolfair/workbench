import { Component, ViewChild, inject, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-guide',
  imports: [
    NzButtonModule,
    RouterLink,
    NzSliderModule,
    FormsModule,
    NzStepsModule,
    NzCardModule,
    NzIconModule

  ],


  templateUrl: './guide.component.html',
  styleUrl: './guide.component.less'
})
export class GuideComponent {
  @ViewChild('hotTags') hotTags!: ElementRef;
  myChart: any;

  defaultTitle = document.title;
  constructor(
    private msg: NzMessageService
  ) {}

  timeoutID: any;

  height = 600;
  nowstep = 0;

  index = 0;
  maxIndex = 6;

  
  onIndexChange(index: number): void {
    this.index = index;
  }

  pre(): void {
    this.index -= 1;
  }

  next(): void {
    this.index += 1;
  }

  done(): void {
    console.log('done');
  }

  ngOnInit(): void {
    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState == 'hidden'){
        document.title = '(TAT):D'
      }else{
        document.title = '(*V*)'
        this.timeoutID = setTimeout(()=>{
          document.title = this.defaultTitle
        },1000)
      }
    })
    this.height = window.innerHeight - 130;


  }

  ngOnDestroy () {
    clearTimeout(this.timeoutID);
  }


  ngAfterViewInit(): void {

  }


  setstep(step: any){
    this.nowstep = step;
    const slider = document.getElementById('left-box');
    console.log(slider);

    if(slider){
      slider.scrollTo({
        top: step * 200,
        left: 0,
        behavior: 'smooth'
      });
      console.log(slider.scrollTop);
      console.log(top);
    }

  }

}
