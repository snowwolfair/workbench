import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-litematica',
  imports: [NzDividerModule, NzCardModule],
  templateUrl: './litematica.component.html',
  styleUrl: './litematica.component.less'
})
export class LitematicaComponent {
  onLoding = false;
  height = 1200;
  ngOnInit(): void {
    this.height = window.innerHeight - 160;
  }

  loding(){
    console.log('loding');
  }
}
