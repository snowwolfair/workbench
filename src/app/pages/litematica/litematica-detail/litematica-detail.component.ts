import { Component, inject } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-litematica-detail',
  imports: [NzCardModule, NzFlexModule, NzTagModule, NzGridModule],

  templateUrl: './litematica-detail.component.html',
  styleUrl: './litematica-detail.component.less'
})
export class LitematicaDetailComponent {
  parentData = inject(NZ_MODAL_DATA);
  data = this.parentData.data;
  constructor() {
    console.log(this.data);
  }
}