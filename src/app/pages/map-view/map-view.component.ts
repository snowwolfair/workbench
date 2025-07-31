import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-map-view',
    imports: [CommonModule],
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.css']
})
export class MapViewComponent {
  // 这里只保留地图相关逻辑，如需扩展可在此添加
}
