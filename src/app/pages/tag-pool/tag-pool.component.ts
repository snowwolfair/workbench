import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tag {
  id: number;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

@Component({
  selector: 'app-tag-pool',
  imports: [CommonModule],
  templateUrl: './tag-pool.component.html',
  styleUrl: './tag-pool.component.less'
}) 
export class TagPoolComponent implements OnInit, AfterViewInit {
  @ViewChild('tagPool') tagPool!: ElementRef;
  availableTags: Tag[] = [];
  selectedTags: Tag[] = [];
  poolWidth = 0;
  poolHeight = 0;
  animationId: number | null = null;

  ngOnInit() {
    // 初始化标签数据
    this.initializeTags();
  }

  ngAfterViewInit() {
    // 获取容器尺寸
    this.poolWidth = this.tagPool.nativeElement.offsetWidth;
    this.poolHeight = this.tagPool.nativeElement.offsetHeight;

    console.log(this.poolWidth, this.poolHeight);


    // 开始动画
    this.animate();
  }

  initializeTags() {
    const tagNames = [
      {'name':'JavaScript','color':'#4CAF50'},
      {'name':'TypeScript','color':'#2196F3'},
      {'name':'Angular','color':'#FF9800'},
      {'name':'React','color':'#9C27B0'},
      {'name':'Vue','color':'#3F51B5'},
      {'name':'HTML','color':'#00BCD4'},
      {'name':'CSS','color':'#FF5722'}
    ];

    this.availableTags = tagNames.map((tag, index) => ({
      id: index,
      name: tag.name,
      x: Math.random() * 400,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: tag.color
    }));
  }

  animate() {
    this.updateTagPositions();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  updateTagPositions() {
    this.availableTags.forEach(tag => {
      // 更新位置
      tag.x += tag.vx;
      tag.y += tag.vy;

      // 边界检测和反弹
      const tagWidth = 10; // 估计值，实际应用中可能需要动态获取
      const tagHeight = 10; // 估计值

      if (tag.x < 0 || tag.x + tagWidth > this.poolWidth) {
        tag.vx = -tag.vx;
        tag.x = tag.x < 0 ? 0 : this.poolWidth - tagWidth;
      }

      if (tag.y < 0 || tag.y + tagHeight > this.poolHeight) {
        tag.vy = -tag.vy;
        tag.y = tag.y < 0 ? 0 : this.poolHeight - tagHeight;
      }
    });
  }

  selectTag(tag: Tag) {
    // 从可用标签中移除
    this.availableTags = this.availableTags.filter(t => t.id !== tag.id);
    // 添加到选中标签
    this.selectedTags.push(tag);
  }

  deselectTag(tag: Tag) {
    // 从选中标签中移除
    this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
    // 重新添加到可用标签，并设置随机位置
    tag.x = Math.random() * (this.poolWidth - 100);
    tag.y = Math.random() * (this.poolHeight - 30);
    this.availableTags.push(tag);
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
