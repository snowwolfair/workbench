import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { _HttpClient } from '@delon/theme';

import { G2CardModule } from '@delon/chart/card';
import { TrendModule } from '@delon/chart/trend';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { FriendlyNamePipe } from '../../pipes/friendly-name.pipe';

import echarts from 'src/assets/echarts/echarts';

@Component({
  selector: 'app-users',
  imports: [CommonModule, TimeFormatPipe, FriendlyNamePipe, G2CardModule, TrendModule, NzIconModule, NzSkeletonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent {
  constructor(private http: _HttpClient) {}

  timeInfo: any[] = [];
  topFiveList: any[] = [];

  loading = false;

  ngOnInit(): void {
    this.getDailyList();
  }

  data: any[] = [];

  getDailyList() {
    this.loading = true;
    this.http.get('/assets/workTime/app_usage.json').subscribe((data: Record<string, { total: number; daily: Record<string, number> }>) => {
      console.log(data);
      const newTimeInfo = [];
      Object.entries(data).forEach(([appName, info]) => {
        const dailyList = Object.entries(info.daily).map(([date, time]) => ({
          date: new Date(date),
          time: time
        }));

        newTimeInfo.push({
          appname: appName,
          usetime: {
            total: info.total, // 或用 parseInt/Number.toFixed 等
            daily: dailyList
          }
        });
        // const map = JSON.parse(data);
        // console.log(map);
      });
      this.timeInfo = newTimeInfo;
      this.getTopFiveList();

      console.log(this.timeInfo);
      this.dayOnDay();
      this.weekOnWeek();

      setTimeout(() => {
        this.initChart();
      }, 10);
    });
  }

  getTopFiveList() {
    this.topFiveList = this.timeInfo.sort((a, b) => b.usetime.total - a.usetime.total).slice(0, 5);
    this.loading = false;
    console.log(this.topFiveList);
  }

  formatSeconds(seconds: number): string {
    // 四舍五入到整数秒（避免 59.999 显示为 59 秒）
    const totalSeconds = Math.round(seconds);

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  date = new Date();
  newdate = new Date(Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()));
  yestoday = new Date(this.newdate);

  dayOnDay() {
    this.timeInfo.forEach(item => {
      const todayIndex = item.usetime.daily.findIndex(i => i.date.getTime() == this.newdate.getTime());
      this.yestoday.setDate(this.newdate.getDate() - 1);

      const yestodayIndex = item.usetime.daily.findIndex(i => i.date.getTime() == this.yestoday.getTime());

      let dodrate = 0;
      if (todayIndex == -1 && yestodayIndex !== -1) {
        dodrate = -item.usetime.daily[yestodayIndex].time / 60;
      } else if (todayIndex !== -1 && yestodayIndex == -1) {
        dodrate = item.usetime.daily[todayIndex].time / 60;
      } else if (yestodayIndex == -1 && todayIndex == -1) {
      } else {
        dodrate =
          ((item.usetime.daily[todayIndex].time - item.usetime.daily[yestodayIndex].time) / item.usetime.daily[yestodayIndex].time) * 10;
      }
      item.usetime = {
        ...item.usetime,
        dodrate: dodrate
      };
    });
    console.log(this.timeInfo);
  }

  weekstart = new Date(this.newdate);
  lastweekstart = new Date(this.weekstart);
  weekOnWeek() {
    this.timeInfo.forEach(item => {
      let weekstartIndex: number = 0;
      let nowweek = 0;

      while (true) {
        weekstartIndex = item.usetime.daily.findIndex(i => i.date.getTime() == this.weekstart.getTime());
        if (weekstartIndex != -1) {
          nowweek = nowweek + item.usetime.daily[weekstartIndex].time;
        }
        if (this.weekstart.getDay() == 1) {
          break;
        }
        this.weekstart.setDate(this.weekstart.getDate() - 1);
      }

      this.lastweekstart.setDate(this.weekstart.getDate() - 1);
      let lastweekstartIndex = 0;
      let lastweek = 0;
      while (true) {
        lastweekstartIndex = item.usetime.daily.findIndex(i => i.date.getTime() == this.lastweekstart.getTime());
        if (lastweekstartIndex != -1) {
          lastweek = lastweek + item.usetime.daily[lastweekstartIndex].time;
        }
        if (this.lastweekstart.getDay() == 1) {
          break;
        }
        this.lastweekstart.setDate(this.lastweekstart.getDate() - 1);
      }
      let wowrate: number = 0;
      if (lastweek != 0 && nowweek != 0) {
        wowrate = ((nowweek - lastweek) / lastweek) * 10;
      } else if (lastweek == 0 && nowweek != 0) {
        wowrate = nowweek / 60;
      } else {
        wowrate = -(lastweek / 60);
      }

      item.usetime = {
        ...item.usetime,
        wowrate: wowrate
      };
    });
    console.log(this.timeInfo);
  }

  topDay(item: any) {
    const top = item.usetime.daily.reduce((prev, cur) => (prev.time > cur.time ? prev : cur));
    const str = `${top.date.getFullYear()}-${top.date.getMonth() + 1}-${top.date.getDate()} : ${this.formatSeconds(top.time)}`;
    return str;
  }

  topchart: any;
  topchartoption: any;
  initChart() {
    // 初始化 ECharts 实例
    if (this.topchart) {
      this.topchart.dispose();
    }
    this.topchart = echarts.init(document.getElementById('top-use-chart'));
    this.topchartoption = {
      xAxis: {
        type: 'category',
        data: this.data
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          name: '2015',
          data: [89.3, 92.1, 94.4, 85.4]
        },
        {
          type: 'bar',
          name: '2016',
          data: [95.8, 89.4, 91.2, 76.9]
        },
        {
          type: 'bar',
          name: '2017',
          data: [97.7, 83.1, 92.5, 78.1]
        }
      ]
    };
    this.topchart.setOption(this.topchartoption);
  }

  users = [
    { name: '张三', email: 'zhangsan@example.com' },

    { name: '李四', email: 'lisi@example.com' },
    { name: '王五', email: 'wangwu@example.com' },
    { name: '赵六', email: 'zhaoliu@example.com' }
  ];
}
