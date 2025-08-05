import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts';

@Component({
    selector: 'app-map-view',
    imports: [CommonModule],
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.less']
})
export class MapViewComponent {
  // 这里只保留地图相关逻辑，如需扩展可在此添加
}
