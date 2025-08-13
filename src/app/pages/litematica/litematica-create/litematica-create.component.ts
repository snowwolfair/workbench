import { Component, inject } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TagPoolComponent } from '../../tag-pool/tag-pool.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalModule } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-litematica-create',
  imports: [
    NzFormModule, 
    NzInputModule,
    FormsModule,
    NzUploadModule, 
    NzIconModule, 
    NzButtonModule, 
    NzModalModule,
    ReactiveFormsModule,
    NzAlertModule,
    TagPoolComponent
  ],

  templateUrl: './litematica-create.component.html',
  styleUrl: './litematica-create.component.less'
})
export class LitematicaCreateComponent {
  parentData = inject(NZ_MODAL_DATA);
  validateForm!: FormGroup;

  visible = false;

  filevisible = false;



  tags: any[] = [];

  fileList: any[] = []

  constructor(
    private fb: FormBuilder,
    private nzModalRef: NzModalRef,
    private http: _HttpClient
  ){
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [''],
    });
  }

  showUploadList = {
    showPreviewIcon: false,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  fileSize = 1024 * 10 * 1024;

  inputValue: string;

  ngOnInit(): void {
  }

  submitImport(){
    const file = this.fileList[0] || '';
    let formData = new FormData();

    if(!this.validateForm.value.name){
      this.visible = true;
      return;
    }else{
      this.visible = false;
    }


    formData.append('name', this.validateForm.value.name);
    const filteredTags = this.tags.map(tag => ({
      name: tag.name,
      color: tag.color
    }));
    formData.append('tags', JSON.stringify(filteredTags));
    formData.append('description', this.validateForm.value.description);

    if(!file){
      this.filevisible = true;
      return;
    }else{
      this.filevisible = false;
    }
    formData.append('file', file);

    this.nzModalRef.close(formData);
  }

  getTag(event: any){
    this.tags = event;
    console.log(this.tags);
  }

  handleCancel() {
    this.nzModalRef.destroy('onCancel');
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    if (file.type !== 'application/json') {
      this.filevisible = true;
      return false;
    }
    const isLt10M = file.size! / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.filevisible = true;
      return false;
    }

    this.fileList = [file];
    this.filevisible = false;
    return false;
  };
}
