import { Component, Input, OnChanges } from '@angular/core';
import { NgClass } from '@angular/common';

export interface DataModel {
  colorLight: string;
  colorDark: string;
  size: string;
  name: string;
  icon: string;
}


@Component({
  selector: 'colorful-tag',
  imports: [NgClass],
  templateUrl: './colorful-tag.component.html',
  styleUrl: './colorful-tag.component.less'
})
export class ColorfulTagComponent implements OnChanges{
  @Input()
  data: DataModel = {
    colorLight: '',
    colorDark: '',
    size: '',
    name: '',
    icon: '',
  };

  gradientStyle = 'linear-gradient(45deg, #FFD700, #FFA500)';

  constructor(
  ) { }

  ngOnChanges(): void {
    if (!this.data) {
      this.data = {
        colorLight: '',
        colorDark: '',
        size: '',
        name: '',
        icon: '',
      };
    }
    // 验证输入参数
    if (!this.data.colorLight) {
      this.data.colorLight = '#4CAF50';
    }
    if (!this.data.colorDark) {
      this.data.colorDark = '#2E7D32';
    }
    
    if (!['small', 'medium', 'large'].includes(this.data.size)) {
      this.data.size = 'medium';
    }

    this.gradientStyle = `linear-gradient(45deg, ${this.data.colorLight}, ${this.data.colorDark})`;
  }
}
