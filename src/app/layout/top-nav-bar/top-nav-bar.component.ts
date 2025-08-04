import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
    selector: 'app-top-nav-bar',
    templateUrl: './top-nav-bar.component.html',
    styleUrls: ['./top-nav-bar.component.less'],
    standalone: true,
    imports: [NzMenuModule, NzIconModule, RouterLink]
})
export class TopNavBarComponent {}
