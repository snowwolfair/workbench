import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LitematicaComponent } from '../../pages/litematica/litematica.component';
import { MapViewComponent } from '../../pages/map-view/map-view.component';

@Component({
    selector: 'app-workspace',
    imports: [CommonModule, LitematicaComponent, MapViewComponent],
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.less']
})
export class WorkspaceComponent {}
