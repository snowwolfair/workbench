import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { _HttpClient } from '@delon/theme';

import { G2CardModule } from '@delon/chart/card';
import { TrendModule } from '@delon/chart/trend';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { FriendlyNamePipe } from '../../pipes/friendly-name.pipe';

import * as echarts from '../../../assets/echarts/echarts';

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

  getDailyList() {
    this.loading = true;
    this.http.get('/assets/workTime/app_usage.json').subscribe((data: Record<string, { total: number; daily: Record<string, number> }>) => {
      console.log(data);
      Object.entries(data).forEach(([appName, info]) => {
        const dailyList = Object.entries(info.daily).map(([date, time]) => ({
          date: new Date(date),
          time: time
        }));

        this.timeInfo.push({
          appname: appName,
          usetime: {
            total: info.total, // 或用 parseInt/Number.toFixed 等
            daily: dailyList
          }
        });
        // const map = JSON.parse(data);
        // console.log(map);
      });
      this.getTopFiveList();

      console.log(this.timeInfo);
      this.dayOnDay();
      this.weekOnWeek();
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

  dayOnDay() {
    this.timeInfo.forEach(item => {
      const todayIndex = item.usetime.daily.findIndex(i => i.date.getTime() == this.newdate.getTime());
      let yestoday = new Date(this.newdate);
      yestoday.setDate(this.date.getDate() - 1);
      const yestodayIndex = item.usetime.daily.findIndex(i => i.date.getTime() == yestoday.getTime());

      let dodrate = 0;
      if (todayIndex == -1 && yestodayIndex !== -1) {
        dodrate = Math.round((-item.usetime.daily[yestodayIndex].time / 60) * 100);
      } else if (todayIndex !== -1 && yestodayIndex == -1) {
        dodrate = Math.round((item.usetime.daily[todayIndex].time / 60) * 100);
      } else if (yestodayIndex == -1 && yestodayIndex == -1) {
      } else {
        dodrate = Math.round(
          ((item.usetime.daily[todayIndex].time - item.usetime.daily[yestodayIndex].time) / item.usetime.daily[yestodayIndex].time) * 100
        );
      }
      item.usetime = {
        ...item.usetime,
        dodrate: dodrate
      };
    });
    console.log(this.timeInfo);
  }

  weekOnWeek() {
    this.timeInfo.forEach(item => {
      let weekstart = new Date(this.newdate);
      let weekstartIndex: number = 0;
      let nowweek = 0;

      while (true) {
        weekstartIndex = item.usetime.daily.findIndex(i => i.date.getTime() == weekstart.getTime());
        if (weekstartIndex != -1) {
          nowweek = nowweek + item.usetime.daily[weekstartIndex].time;
        }
        if (weekstart.getDay() == 1) {
          break;
        }
        weekstart.setDate(weekstart.getDate() - 1);
      }

      let lastweekstart = new Date(weekstart);
      lastweekstart.setDate(weekstart.getDate() - 1);
      let lastweekstartIndex = 0;
      let lastweek = 0;
      while (true) {
        lastweekstartIndex = item.usetime.daily.findIndex(i => i.date.getTime() == lastweekstart.getTime());
        if (lastweekstartIndex != -1) {
          lastweek = lastweek + item.usetime.daily[lastweekstartIndex].time;
        }
        if (lastweekstart.getDay() == 1) {
          break;
        }
        lastweekstart.setDate(lastweekstart.getDate() - 1);
      }
      let wowrate: number;
      if (lastweek != 0) {
        wowrate = Math.round(((nowweek - lastweek) / lastweek) * 100);
      } else {
        wowrate = Math.round((nowweek / 60) * 100);
      }

      item.usetime = {
        ...item.usetime,
        wowrate: wowrate
      };
    });
    console.log(this.timeInfo);
  }

  users = [
    { name: '张三', email: 'zhangsan@example.com' },
    { name: '李四', email: 'lisi@example.com' },
    { name: '王五', email: 'wangwu@example.com' },
    { name: '赵六', email: 'zhaoliu@example.com' }
  ];
}
