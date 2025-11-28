import { Component, ViewChild, ElementRef, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';

// eslint-disable-next-line import/no-unassigned-import
import 'echarts-wordcloud';

@Component({
  selector: 'app-toolbox',
  imports: [NzButtonModule, RouterLink, NzMenuModule],

  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.less']
})
export class ToolboxComponent implements OnDestroy {
  openMap: Record<string, boolean> = {
    sub1: true,
    sub2: false,
    sub3: false
  };

  @ViewChild('hotTags') hotTags!: ElementRef;

  defaultTitle = document.title;
  private msg = inject(NzMessageService);

  timeoutID: any;

  ap: any;

  ngOnDestroy() {
    clearTimeout(this.timeoutID);
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }
}
