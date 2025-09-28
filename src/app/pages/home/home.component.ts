import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDividerComponent } from "ng-zorro-antd/divider";
import { ElementRef, ViewChild, HostListener } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

import APlayer from 'aplayer';

@Component({
  selector: 'app-home',
  imports: [
    NzButtonModule,
    NzAffixModule,
    NzDividerComponent,
    CommonModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  @ViewChild('stickyParallaxHeader') stickyParallaxHeader!: ElementRef;
  @ViewChild('affixLeftBox') affixLeftBox;

  constructor( 
    public router:Router,
    private message: NzMessageService
  ){}

  ap: any;
  array = [1, 2, 3, 4];

  ngAfterViewInit(): void {
    this.ap = new APlayer({

      container: document.getElementById('aplayer'),
      theme: '#FADFA3',
      audio: [
        {
          name: '你好',
          artist: '周杰伦',
          url: 'https://music.163.com/song/media/outer/url?id=347230.mp3',
          cover: 'https://p1.music.126.net/64t8y9hU2Yj3R3Y9hU2YjQ==/109951163235222221.jpg',
        },
      ],
    });

  }

  
  vhInPx = window.innerHeight * 0.1;
  vwInPx = window.innerWidth * 0.2;

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.vhInPx = window.innerHeight * 0.1;
    this.vwInPx = window.innerWidth * 0.2;
  }

  gotoLogin() {
    this.router.navigateByUrl('/passport/login');
  }

  joinUs() {
    this.message.info('还没做这个功能');
    // this.router.navigateByUrl('/passport/register');
  }

  onChange(status: boolean) {
    if(status){
      
      this.affixLeftBox.affixStyle.width = this.vwInPx + 'px';
      
    }else{
    }
  }
  
}
