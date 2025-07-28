import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../components/map/map.component';
import { ComponentListComponent, ComponentItem } from '../../components/component-list/component-list.component';
import { ComponentDetailComponent } from '../../components/component-detail/component-detail.component';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, MapComponent, ComponentListComponent, ComponentDetailComponent],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent {
  selectedComponent: ComponentItem | null = null;

  onComponentSelected(component: ComponentItem) {
    this.selectedComponent = component;
    console.log('选中组件:', component);
  }

  onCloseDetail() {
    this.selectedComponent = null;
  }

  onViewOnMap(component: ComponentItem) {
    console.log('在地图上查看:', component);
    // 这里可以添加在地图上显示组件的逻辑
  }

  onDownload(component: ComponentItem) {
    console.log('下载组件:', component);
    // 这里可以添加下载组件的逻辑
  }

  onDelete(component: ComponentItem) {
    console.log('删除组件:', component);
    // 这里可以添加删除组件的逻辑
    this.selectedComponent = null;
  }
}
