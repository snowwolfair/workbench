import { Component, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router, InMemoryScrollingOptions, withInMemoryScrolling, InMemoryScrollingFeature } from '@angular/router';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDividerComponent } from "ng-zorro-antd/divider";
import { ElementRef, ViewChild, HostListener } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { _HttpClient } from '@delon/theme';
import { ColorfulTagComponent } from '../../components/home/colorful-tag.component';
import { HttpContext } from '@angular/common/http';
import { ALLOW_ANONYMOUS } from '@delon/auth';


import APlayer from 'aplayer';

@Component({
  selector: 'app-home',
  imports: [
    NzButtonModule,
    NzAffixModule,
    NzDividerComponent,
    CommonModule,
    ColorfulTagComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  @ViewChild('stickyParallaxHeader') stickyParallaxHeader!: ElementRef;

  private readonly http = inject(_HttpClient);

  constructor( 
    public router:Router,
    private message: NzMessageService
  ){}

  ap: any;
  tagData: any[] = [];

  scrollConfig: InMemoryScrollingOptions = {
    anchorScrolling: 'enabled'
  };

  inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(this.scrollConfig);

  ngOnInit(): void {
    
    //  获取用户tag信息
    //  type = 1 : 获取用户tag信息
    //  type = 2 : 获取可用的所有tag
    //  id : 用户id
    this.http.get('/cssser/getData',
      {
          type: 1,
          id: 1,
      },
      {
        context: new HttpContext().set(ALLOW_ANONYMOUS, true)
      }
    ).subscribe((res: any) => {
        this.tagData = res.data;
        console.log(this.tagData[0].name);
    });

  }

  ngAfterViewInit(): void {

    // 初始化aplayer
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

    // 监听窗口变化，更新固钉的位置
    this.vhInPx = window.innerHeight * 0.1;
    this.vwInPx = window.innerWidth * 0.2;
  }

  gotoLogin() {
    this.router.navigateByUrl('/passport/passport/login');
  }


  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  joinUs() {
    this.message.info('还没做这个功能');
    // this.router.navigateByUrl('/passport/register');
  }

  // minArraySum(nums: number[], k: number): number {
  //   let changed = true;
  //   while (changed && nums.length > 0) {
  //     changed = false;
  //     for (let j = 0; j < nums.length; j++) {
  //       let sum = 0;
  //       let h = 0;
  //       for (let i = j; i < nums.length; i++) {
  //           sum += nums[i];
  //           h++;
  //           console.log(sum);
  //           console.log(h);
  //           console.log(i);
  //           if (sum % k == 0) {
  //               nums.splice(j, h)
  //               console.log(nums);
  //               changed = true;
  //               break;
  //           }
  //       }
  //       if (changed) {
  //         break;
  //       }
  //     }
  //   };
  //   console.log(nums.reduce((a, b) => a + b, 0));
  //   return nums.reduce((a, b) => a + b, 0);
  // }
}
