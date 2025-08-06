import { Component } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-litematica-create',
  imports: [NzFormModule, NzUploadModule],

  templateUrl: './litematica-create.component.html',
  styleUrl: './litematica-create.component.less'
})
export class LitematicaCreateComponent {

}
