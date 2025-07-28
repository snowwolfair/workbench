import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ComponentItem {
  id: number;
  name: string;
  date: string;
  description?: string;
  size?: string;
}

@Component({
  selector: 'app-component-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.css']
})
export class ComponentListComponent {
  @Output() componentSelected = new EventEmitter<ComponentItem>();

  components: ComponentItem[] = [
    { id: 1, name: '城堡.nbt', date: '2024-01-15', description: '中世纪城堡建筑', size: '2.5MB' },
    { id: 2, name: '村庄.nbt', date: '2024-01-10', description: '完整村庄布局', size: '1.8MB' },
    { id: 3, name: '农场.nbt', date: '2024-01-05', description: '自动化农场系统', size: '1.2MB' },
    { id: 4, name: '矿洞.nbt', date: '2023-12-28', description: '地下矿洞网络', size: '3.1MB' },
    { id: 5, name: '桥梁.nbt', date: '2023-12-20', description: '石拱桥设计', size: '0.8MB' }
  ];

  selectedComponent: ComponentItem | null = null;

  selectComponent(component: ComponentItem) {
    this.selectedComponent = component;
    this.componentSelected.emit(component);
  }

  uploadComponent() {
    // 上传功能将在后续实现
    console.log('上传组件');
  }
}
