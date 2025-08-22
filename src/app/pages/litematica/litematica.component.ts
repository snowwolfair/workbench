import { Component, HostListener, ElementRef, ViewChild, ViewChildren,} from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationComponent } from "ng-zorro-antd/pagination";
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LitematicaCreateComponent } from './litematica-create/litematica-create.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LitematicaDetailComponent } from './litematica-detail/litematica-detail.component';
import { ScrollDispatcher, ScrollingModule } from '@angular/cdk/scrolling';




// import { MessageService } from 'src/app/core/services/message.service';



@Component({
  selector: 'app-litematica',
  imports: [
    NzDividerModule,
    NzCardModule, 
    NzPaginationComponent, 
    NzPageHeaderModule, 
    NzTagModule, 
    NzGridModule, 
    NzTypographyModule, 
    NzInputModule,
    NzIconModule,
    ScrollingModule
  ],
  templateUrl: './litematica.component.html',
  styleUrl: './litematica.component.less'
})
export class LitematicaComponent {
  tags = [
    {'name': 'Unremovable', 'color': 'red'}, 
    {'name': 'Tag 2', 'color': 'green'}, 
    {'name': 'Tag 3', 'color': 'blue'}
  ];

  listOfData: any[] = [];
  dragImages: HTMLImageElement[] = [];
  height = 500;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  key = '';

  loading = false;
  ftion: number = 0;

  constructor(
    private modalService: NzModalService,
    private http: _HttpClient,
    public msg: NzMessageService,
  ) {}

  onEnter(event: any) {
    console.log(event.target.value);
    this.key = event.target.value;
    this.pageIndex = 1;
    this.getListofData();
  }

  ngOnInit(): void {
    this.height = window.innerHeight - 280;
    this.listOfData = [
      // {
      //   id: 1,
      //   title: 'Title 1',
      //   author: 'Author 1',
      //   size: 100,
      //   tags: [{'name': 'Tag 1', 'color': 'red'}],
      //   description: '这是一个litematica文件Ant Design\'s design team preferred to design with the HSB color model, which makes it easier for designers 1',
      //   img: 'assets/logo.svg'
      // },
      // {
      //   id: 2,
      //   title: 'Title',
      //   author: 'Dragon_Flight',
      //   size: 200,
      //   tags: [{'name': 'Tag 2', 'color': 'green'}, {'name': 'Tag 3', 'color': 'blue'}],
      //   description: '这是一个litematica文件Ant Design\'s design team preferred to design with the HSB color model, which makes it easier for designers 2'
      // },
      // {
      //   id: 3,
      //   title: 'Title 3',
      //   author: 'Author 3',
      //   size: 300,
      //   tags: [{'name': 'Tag 3', 'color': 'blue'}],
      //   description: '这是一个litematica文件Ant Design\'s design team preferred to design with the HSB color model, which makes it easier for designers 3'
      // }
    ];
    console.log(this.loading);
    this.getListofData();
    
  }

  showtagcolor = 'red';

  onLoding = false;

  dragImage = new Image();

  size = 32;

  author: string = '张三';

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  @HostListener('window:scroll', ['$event'])


  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    event.dataTransfer.setData('text/plain', 'litematica');

    const target = event.target as HTMLElement;

    const index = parseInt(target.getAttribute('data-index') || '0', 10);
    this.dragImage = this.dragImages[Number(index)];

    event.dataTransfer.setDragImage(this.dragImage, 50, 50);
    
    event.dataTransfer.effectAllowed = 'move';
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    event.dataTransfer.clearData();
  }

  detailModal: any;

  loding(data: any){
    this.detailModal = this.modalService.create({
      nzWidth: 800,
      nzTitle: '模型详情',
      nzContent: LitematicaDetailComponent,
      nzFooter: null,
      nzData: {
        data: data
      }
    });
  }

  addModal: any;

  showmodel(){
    this.addModal = this.modalService.create({
      nzWidth: 800,
      nzTitle: '上传模型',
      nzContent: LitematicaCreateComponent,
      nzFooter: null,
    });
    this.addModal.afterClose.subscribe((result: any) => {
      if(result){
        this.sendData(result);
      }

      console.log(result);
    });
  }

  sendData(data: any){
    const params = {
      title: data.get('name'),
      author: data.author,
      file: data.get('file'),
      tags: data.getAll('tags'),
      description: data.get('description')
    }
    this.http
      .post('/litematica/saveData', params)
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.msg.success(res.message);
          this.getListofData();
        } else {
          this.msg.error(res.message);
        }
      });
  }

  getListofData(){
    this.loading = true;
    console.log(this.loading)
    
    this.http
      .get('/litematica/getData', {
          key: this.key,
          page: this.pageIndex,
          limit: this.pageSize
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.success) {
            if(this.ftion === 1){
              this.listOfData = [...this.listOfData, ...res.data];
              this.total = res.count;
              this.loading = false;
              this.ftion = 0;
            }else{
              this.scrollContainer.nativeElement.scrollTop = 0;
              this.listOfData = res.data;
              this.total = res.count;
              this.loading = false;
            }       
        } else {
          this.msg.error(res.message);
          setTimeout(() => {
            this.loading = false;
          }, 1000);  
        }
        this.dragImages = this.listOfData.map(data => {
          const img = new Image();
          img.src = data.img || 'assets/rgba.png';
          return img;
        });
      });
  }

  @ViewChild('tableContainer') scrollContainer!: ElementRef;


  onScroll(event: Event){
    
    const scrollTop = (event.target as HTMLElement).scrollTop;
    const scrollHeight = (event.target as HTMLElement).scrollHeight;
    const clientHeight = (event.target as HTMLElement).clientHeight;

    if (scrollTop + clientHeight + 5 >= scrollHeight && !this.loading && this.total / this.pageSize > this.pageIndex) {

      console.log(this.total / this.pageSize,this.pageIndex);

      this.pageIndex++;
      this.ftion = 1;
      
      this.getListofData();
    }
  }



  //后端某个api需要传入data，data中包含以下字段
  //title: 标题
  //author: 作者
  //size: 大小
  //tags: 标签数组
  //description: 描述

  //tags是一个数组，数组每个元素是一个对象，对象有name和color属性

}
