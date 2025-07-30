import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavBarComponent } from './layout/top-nav-bar/top-nav-bar.component';

@Component({
  selector: 'app-root',
  template: `
    <app-top-nav-bar></app-top-nav-bar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  imports: [RouterOutlet, TopNavBarComponent],
})
export class AppComponent {}


