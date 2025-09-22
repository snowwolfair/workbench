import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';


@Component({
  selector: 'app-home',
  imports: [
    NzButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {

}
