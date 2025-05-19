import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  template: '<h1>{{user}}</h1>', 
})
export class UserComponent {
  user = 'hdsf';
  
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [UserComponent,RouterOutlet],
})
export class AppComponent {
  title = 'mywork';
  city = 'San franceseco';
  isLoggin = true;
}
