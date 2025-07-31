import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavBarComponent } from '../../layout/top-nav-bar/top-nav-bar.component';
import { LitematicaComponent } from '../../pages/litematica/litematica.component';
import { MapViewComponent } from '../../pages/map-view/map-view.component';

@Component({
    selector: 'app-workspace',
    imports: [CommonModule, TopNavBarComponent, LitematicaComponent, MapViewComponent],
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent {}
