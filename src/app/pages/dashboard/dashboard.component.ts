import { Component, ViewChild, inject } from '@angular/core';
import { G2TagCloudClickItem, G2TagCloudData, G2TagCloudModule, G2TagCloudComponent } from '@delon/chart/tag-cloud';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dashboard',
  imports: [NzButtonModule, G2TagCloudModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent {
  @ViewChild('tagCloud') private readonly tagCloud!: G2TagCloudComponent;


  constructor(
    private msg: NzMessageService
  ) {
    this.tagCloud.chart.tooltip(false);
  }


  data: G2TagCloudData[] = [
    {
      name: 'Angular',
      value: 100,
      color: '#f50'
    },
    {
      name: 'React',
      value: 80,
      color: '#2db7f5'
    },
    {
      name: 'Vue',
      value: 60,
      color: '#87d068'
    },
    {
      name: 'TypeScript',
      value: 40,
      color: '#007acc'
    },
    {
      name: 'JavaScript',
      value: 20,
      color: '#e6db74'
    },
    {
      name: 'HTML',
      value: 10,
      color: '#e44d26'
    },
    {
      name: 'CSS',
      value: 10,
      color: '#264de4'
    },

  ];

  handleClick(data: G2TagCloudClickItem): void {
    this.msg.info(`${data.item.name} - ${data.item.value}`);
  }
}
