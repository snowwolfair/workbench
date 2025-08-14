import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, QueryList, ViewChildren, Output, EventEmitter} from '@angular/core';

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
  background: string;
  border: string;
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

  
  @Output() getTag = new EventEmitter<Tag[]>();

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
      {'name':'农业','color':'#389e0d','backgroundcolor':'#f6ffed','bordercolor':'#b7eb8f'},
      {'name':'科技','color':'#1890ff','backgroundcolor':'#e6f7ff','bordercolor':'#91d5ff'},
      {'name':'工业','color':'#d48806','backgroundcolor':'#fffbe6','bordercolor':'#ffe58f'},
      {'name':'实用','color':'#08979c','backgroundcolor':'#e6fffb','bordercolor':'#87e8de'},
      {'name':'Vue','color':'#3F51B5','backgroundcolor':'#e6e6ff','bordercolor':'#b3b3ff'},
      {'name':'HTML','color':'#00BCD4','backgroundcolor':'#d6f5ff','bordercolor':'#99e6ff'},
      {'name':'CSS','color':'#FF5722','backgroundcolor':'#ffd6ff','bordercolor':'#ff9999'}
    ];

    this.availableTags = tagNames.map((tag, index) => ({
      id: index,
      name: tag.name,
      x: Math.random() * 400,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: tag.color,
      background: tag.backgroundcolor,
      border: tag.bordercolor,
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
    console.log(this.selectedTags);
    this.getTag.emit(this.selectedTags);

  }

  deselectTag(tag: Tag) {
    // 从选中标签中移除
    this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
    // 重新添加到可用标签，并设置随机位置
    tag.x = Math.random() * (this.poolWidth - 100);
    tag.y = Math.random() * (this.poolHeight - 30);
    this.availableTags.push(tag);
    this.error = false;
    this.getTag.emit(this.selectedTags);
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
