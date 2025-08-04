import { Component } from '@angular/core';
import { TopNavBarComponent } from '../../layout/top-nav-bar/top-nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [TopNavBarComponent, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
