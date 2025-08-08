import { Component } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TagPoolComponent } from '../../tag-pool/tag-pool.component';

@Component({
  selector: 'app-litematica-create',
  imports: [NzFormModule, NzUploadModule, NzIconModule, NzButtonModule, TagPoolComponent],


  templateUrl: './litematica-create.component.html',
  styleUrl: './litematica-create.component.less'
})
export class LitematicaCreateComponent {
  fileList: NzUploadFile[] = [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png'
    }
  ]

  showUploadList = {
    showPreviewIcon: false,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  fileSize = 1024 * 10;



  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    this.fileList = fileList;
  }
}
