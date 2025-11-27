import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { G2CardModule } from '@delon/chart/card';
import { TrendModule } from '@delon/chart/trend';
import { _HttpClient } from '@delon/theme';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import echarts from 'src/assets/echarts/echarts';

import { FriendlyNamePipe } from '../../pipes/friendly-name.pipe';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    TimeFormatPipe,
    FriendlyNamePipe,
    FormsModule,
    NzSelectModule,
    NzButtonModule,
    // NzFormModule,
    G2CardModule,
    TrendModule,
    NzIconModule,
    NzSkeletonModule,
    NzDatePickerModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  private http = inject(_HttpClient);

  searchChange$ = new BehaviorSubject('');

  timeInfo: any[] = [];
  topFiveList: any[] = [];

  loading = false;

  selectedApp?: string = '';
  optionList: any[] = [];

  ngOnInit(): void {
    this.startValue.setDate(this.startValue.getDate() - 5);

    this.getDailyList();

    setTimeout(() => {
      this.searchChange$
        .pipe(
          debounceTime(500),
          map(name => this.getAppNameList(name))
        )
        .subscribe(data => {
          this.optionList = data;
          console.log(this.optionList);
          this.loading = false;
        });
    }, 10);
  }

  data: any[] = [];

  getDailyList() {
    this.loading = true;
    this.http.get('/assets/workTime/app_usage.json').subscribe((data: Record<string, { total: number; daily: Record<string, number> }>) => {
      console.log(data);
      const newTimeInfo = [];
      Object.entries(data).forEach(([appName, info]) => {
        const dailyList = Object.entries(info.daily).map(([date, time]) => ({
          date: date,
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

      // this.getstart();
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
  zdate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  newdate = new Date(Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()));
  yestoday = new Date(this.newdate);

  dayOnDay() {
    this.timeInfo.forEach(item => {
      const todayIndex = item.usetime.daily.findIndex(i => new Date(i.date).getTime() == this.newdate.getTime());
      this.yestoday.setDate(this.newdate.getDate() - 1);

      const yestodayIndex = item.usetime.daily.findIndex(i => new Date(i.date).getTime() == this.yestoday.getTime());

      let dodrate = 0;
      if (todayIndex == -1 && yestodayIndex !== -1) {
        dodrate = -item.usetime.daily[yestodayIndex].time / 60;
      } else if (todayIndex !== -1 && yestodayIndex == -1) {
        dodrate = item.usetime.daily[todayIndex].time / 60;
      } else if (yestodayIndex == -1 && todayIndex == -1) {
        // ?
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
      let weekstartIndex = 0;
      let nowweek = 0;

      while (true) {
        weekstartIndex = item.usetime.daily.findIndex(i => new Date(i.date).getTime() == this.weekstart.getTime());
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
        lastweekstartIndex = item.usetime.daily.findIndex(i => new Date(i.date).getTime() == this.lastweekstart.getTime());
        if (lastweekstartIndex != -1) {
          lastweek = lastweek + item.usetime.daily[lastweekstartIndex].time;
        }
        if (this.lastweekstart.getDay() == 1) {
          break;
        }
        this.lastweekstart.setDate(this.lastweekstart.getDate() - 1);
      }
      let wowrate = 0;
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

    const str = `${new Date(top.date).getFullYear()}-${new Date(top.date).getMonth() + 1}-${new Date(top.date).getDate()} : ${this.formatSeconds(top.time)}`;
    return str;
  }

  startValue: Date = new Date(this.zdate);
  endValue: Date = new Date(this.zdate);

  disabledStartDate = (startValue: Date): boolean => {
    if (startValue.getTime() <= new Date('2025-11-12').getTime() || startValue.getTime() >= this.zdate.getTime()) {
      return true;
    }
    return false;
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!this.startValue || endValue.getTime() <= this.startValue.getTime() || endValue.getTime() > this.zdate.getTime()) {
      return true; // 必须先选开始日期
    }
    return false;
  };

  onSearch(value: string): void {
    // this.loading = true;
    console.log(value);
    this.searchChange$.next(value);
    console.log(this.optionList);
  }

  getAppNameList(name: string): string[] {
    return this.timeInfo.filter(item => item.appname.includes(name)).map(item => item.appname);
  }

  clearEndDate() {
    this.endValue = new Date(this.zdate);
    // this.endValue = null;
  }

  dataSource: any[] = [];
  dataSeries: any[] = [];

  getChartInfo() {
    if (this.topchart) {
      this.topchart.dispose();
    }
    this.topchart = echarts.init(document.getElementById('top-use-chart'));
    console.log(this.selectedApp);
    this.datelist = this.getDatesInRange(this.startValue, this.endValue);
    this.dataSource = [];

    let dimensions: string[] = [];
    dimensions.push('appname');
    dimensions.push(...this.datelist);

    this.dataSource.push(dimensions);

    let applist: any;
    if (!this.selectedApp) {
      applist = this.timeInfo.filter(item => item.usetime.total > 1200);
    } else {
      applist = this.timeInfo.filter(item => item.appname == this.selectedApp);
    }
    console.log(applist);
    for (let item of applist) {
      let row: any[] = [];
      row.push(item.appname);
      for (let date of this.datelist) {
        let index = item.usetime.daily.findIndex(i => new Date(i.date).getTime() == new Date(date).getTime());
        if (index != -1) {
          row.push(Math.round(item.usetime.daily[index].time / 60));
        } else {
          row.push(0);
        }
      }
      this.dataSource.push(row);
    }

    let cot = 0;
    this.dataSeries = [];
    console.log(this.dataSeries);
    while (cot < applist.length) {
      this.dataSeries.push({
        type: 'line',
        seriesLayoutBy: 'row'
      });
      cot++;
    }

    this.topchartoption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      legend: {
        // data: [this.selectedApp]
      },
      dataset: {
        source: this.dataSource
      },
      xAxis: {
        type: 'category',
        gridIndex: 0
      },
      yAxis: { gridIndex: 0 },
      series: this.dataSeries
    };
    console.log(this.dataSource);

    this.topchart.setOption(this.topchartoption);
    console.log(this.topchartoption);
    this.topchart.on('click', (params: any) => {
      this.topchart.dispatchAction({
        type: 'showTip',
        dataIndex: params.dataIndex
      });
      console.log(params.value);
      setTimeout(() => {
        this.topchart.dispatchAction({
          type: 'hideTip'
        });
      }, 10000);
    });
  }

  addChartLine() {
    let applist: any;
    if (!this.selectedApp) {
      return;
    } else {
      applist = this.timeInfo.filter(item => item.appname == this.selectedApp);
    }

    for (let item of applist) {
      let row: any[] = [];
      row.push(item.appname);
      for (let date of this.datelist) {
        let index = item.usetime.daily.findIndex(i => new Date(i.date).getTime() == new Date(date).getTime());
        if (index != -1) {
          row.push(Math.round(item.usetime.daily[index].time / 60));
        } else {
          row.push(0);
        }
      }
      this.dataSource.push(row);
      this.dataSeries.push({
        type: 'line',
        seriesLayoutBy: 'row'
      });

      this.topchartoption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        legend: {
          // data: [this.selectedApp]
        },
        dataset: {
          source: this.dataSource
        },
        xAxis: {
          type: 'category',
          gridIndex: 0
        },
        yAxis: { gridIndex: 0 },
        series: this.dataSeries
      };
      console.log(this.dataSource);

      this.topchart.setOption(this.topchartoption);
      this.topchart.on('click', (params: any) => {
        this.topchart.dispatchAction({
          type: 'highlight',
          dataIndex: params.dataIndex
        });
        console.log(params.value);
        setTimeout(() => {
          this.topchart.dispatchAction({
            type: 'hideTip'
          });
        }, 10000);
      });
    }
  }

  datelist: string[] = [];
  topchart: any;
  topchartoption: any;

  initChart() {
    // 初始化 ECharts 实例
    this.datelist = this.getDatesInRange(this.startValue, this.endValue);
    console.log(this.datelist);
    if (this.topchart) {
      this.topchart.dispose();
    }
    this.topchart = echarts.init(document.getElementById('top-use-chart'));
    this.topchart.showLoading();
    this.topchartoption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      legend: {
        // data: [this.selectedApp]
      },
      dataset: {
        source: [
          ['appname', '2025-11-13', '2025-11-14', '2025-11-15'],
          ['Visual Studio Code', 49, 65, 2],
          ['Microsoft Edge', 48, 282, 454],
          ['Google Chrome', 11, 16, 9]
        ]
      },
      xAxis: {
        type: 'category',
        gridIndex: 0
      },
      yAxis: { gridIndex: 0 },
      series: [
        {
          type: 'line',
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          seriesLayoutBy: 'row'
        }
      ]
    };
    this.topchart.setOption(this.topchartoption);
    this.topchart.hideLoading();
  }

  getDatesInRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];

    // 确保 startDate <= endDate
    if (startDate > endDate) {
      return dates; // 或交换两者，根据需求
    }

    // 创建一个可变的当前日期（避免修改原始 startDate）
    const currentDate = new Date(startDate);

    // 遍历每一天，直到超过 endDate
    while (currentDate <= endDate) {
      // 格式化为 'yyyy-MM-dd'
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需+1
      const day = String(currentDate.getDate()).padStart(2, '0');

      dates.push(`${year}-${month}-${day}`);

      // 增加一天
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  users = [
    { name: '张三', email: 'zhangsan@example.com' },

    { name: '李四', email: 'lisi@example.com' },
    { name: '王五', email: 'wangwu@example.com' },
    { name: '赵六', email: 'zhaoliu@example.com' }
  ];
}
