import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  template: '<h1>{{user}}</h1>', 
})
export class UserComponent {
  user = '1'+1;
}

@Component({
  selector: 'app-root',
  template: `
    <section>
      <app-user />  
    </section>`,
  imports: [UserComponent],
})
export class AppComponent {
  title = 'mywork';
  city = 'San franceseco';
}
