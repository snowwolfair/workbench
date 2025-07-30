import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NzMenuModule],
  templateUrl: './top-nav-bar.component.html',
  styleUrl: './top-nav-bar.component.less'
})
export class TopNavBarComponent {}
