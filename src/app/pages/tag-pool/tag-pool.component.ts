import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';




interface Tag {
  id: number;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-tag-pool',
  imports: [CommonModule, NzCollapseModule, FormsModule, NzIconModule],
  templateUrl: './tag-pool.component.html',
  styleUrl: './tag-pool.component.less'
}) 
export class TagPoolComponent implements OnInit, AfterViewInit {
  @ViewChild('tagPool') tagPool!: ElementRef;
  @ViewChildren('tagRef') tagElements!: QueryList<ElementRef>;
  availableTags: Tag[] = [];
  selectedTags: Tag[] = [];
  poolWidth = 0;
  poolHeight = 0;
  animationId: number | null = null;
  error = false;
  showTagsPool = true;



  ngOnInit() {
    // 初始化标签数据
    this.initializeTags();
  }

  ngAfterViewInit() {
    if (this.showTagsPool && this.tagPool) {
      // 获取容器尺寸
      this.poolWidth = this.tagPool.nativeElement.offsetWidth;
      this.poolHeight = this.tagPool.nativeElement.offsetHeight;

      this.tagElements.forEach((el, index) => {
        const rect = el.nativeElement.getBoundingClientRect();
        this.availableTags[index].width = rect.width;
        this.availableTags[index].height = rect.height;
      });

      this.animate();
    }
  }

  initializeTags() {
    const tagNames = [
      {'name':'农业','color':'#fff1f0'},
      {'name':'科技','color':'#2196F3'},
      {'name':'工业','color':'#FF9800'},
      {'name':'实用','color':'#9C27B0'},
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
      color: tag.color,
      width: 0,
      height: 0
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

      console.log(tag.x, tag.y);


      // 边界检测和反弹
      if (tag.x <= 0 || tag.x + tag.width >= this.poolWidth) {
        tag.vx = -tag.vx;
        tag.x = tag.x < 0 ? 0 : this.poolWidth - tag.width;
      }

      if (tag.y <= 0 || tag.y + tag.height >= this.poolHeight) {
        tag.vy = -tag.vy;
        tag.y = tag.y < 0 ? 0 : this.poolHeight - tag.height;
      }
    });
  }

  selectTag(tag: Tag) {
    if (this.selectedTags.length >= 3) {
      this.error = true;
      return;
    }

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
    this.error = false;
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  showTagPool() {
    this.showTagsPool = !this.showTagsPool;
    this.initializeTags();
    this.ngAfterViewInit();
    console.log(this.poolWidth, this.poolHeight);
  }

}
