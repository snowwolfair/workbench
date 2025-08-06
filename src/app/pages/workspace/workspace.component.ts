import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { LitematicaComponent } from '../../pages/litematica/litematica.component';
import { MapViewComponent } from '../../pages/map-view/map-view.component';

@Component({
    selector: 'app-workspace',
    imports: [CommonModule, LitematicaComponent, MapViewComponent, NzSplitterModule],
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.less']
})
export class WorkspaceComponent {

  loading = false;
  
  height = 100;
  ngOnInit(): void {
    this.height = window.innerHeight - 65;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.height = window.innerHeight - 65;
  }
}
