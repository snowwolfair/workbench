import { Component, ViewChild, inject, ElementRef, AfterViewInit} from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import "echarts-wordcloud";
import * as echarts from 'echarts';


@Component({
  selector: 'app-dashboard',
  imports: [NzButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent {
  @ViewChild('hotTags') hotTags!: ElementRef;
  myChart: any;


  constructor(
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getKeywords();
  }

  ngAfterViewInit(): void {
    this.myChart = echarts.init(this.hotTags.nativeElement);

    this.myChart.setOption(this.option);

    this.myChart.on('click', (params: any) => {
      console.log(params);
      this.msg.success(params.name + '被点击了');
    });

    this.myChart.on('mouseover', (params: any) => {
      console.log(params);
      // this.msg.success(params.name + '被鼠标悬停了');
    });

  }

  getRandomColor() {
    return 'rgb(' + [
      Math.round(Math.random() * 220),
      Math.round(Math.random() * 220),
      Math.round(Math.random() * 220)
    ].join(',') + ')';
  }

  getKeywords() {
   
  }


  keywords =[
      {"name":"有人..游戏..","value":100},
      {"name":"怪猎","value":80},
      {"name":"上班","value":100},
      {"name":"抽象","value":30},
      {"name":"早上好","value":100},
      {"name":"牛逼","value":150},
      {'name':'我的世界',"value":50},
      {'name':'科技',"value":90},
      {'name':'模组',"value":10},
      {'name':'实用',"value":20},
      {'name':'cnm',"value":30},
      {'name':'woc',"value":200},
      {'name':'游戏',"value":100}
  ]
  option = {
    series: [{
      type: 'wordCloud',
      // sizeRange: 词的大小，最小12px，最大60px，可以在这个范围调整词的大小
      sizeRange: [10, 60],
      rotationRange: [-90, 90],
      //rotationStep: 每个词旋转的角度范围和旋转的步进
      rotationStep: 90,
      //gridSize:词间距，数值越小，间距越小，这里间距太小的话，会出现大词把小词套住的情况，比如一个大的口字，中间会有比较大的空隙，这时候他会把一些很小的字放在口字里面，这样的话，鼠标就无法选中里面的那个小字，这里可以用函数根据词云的数量动态返回间距
      gridSize:5,
      // shape这个属性虽然可配置，但是在词的数量不太多的时候，效果不明显，它会趋向于画一个椭圆
      shape: 'pentagon',
      width: '100%',
      height: '100%',
      drawOutOfBound: true,
      layoutAnimation: true,
      textStyle: {
        fontFamily: 'Tahoma',
        fontWeight: 'bold',
        // 颜色可以用一个函数来返回字符串，这里是随机色
        color: function () {
          return 'rgb(' + [
            Math.round(Math.random() * 220),
            Math.round(Math.random() * 220),
            Math.round(Math.random() * 220)
          ].join(',') + ')';
        }
      },
      emphasis: {
        // 在高亮图形时，是否淡出其它数据的图形已达到聚焦的效果
        // 'none' 不淡出其它图形，默认使用该配置。
        // 'self' 只聚焦（不淡出）当前高亮的数据的图形。
        focus: 'self',

        //配置淡出的范围。支持如下配置
        // 'coordinateSystem' 淡出范围为坐标系，默认使用该配置。
        // 'series' 淡出范围为系列。
        // 'global' 淡出范围为全局。
        blurScope:'coordinateSystem',


        textStyle: {
          textShadowBlur: 3,
          textShadowColor: '#333'
        }
      },
      data:this.keywords
    }]
  };

}
