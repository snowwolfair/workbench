import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  // sum: number = 0;
  // start = 1;
  // tp = 0;
  // n = 144;
  // lastn = this.n
  // laststart = 1;

  // w = 6;

  // sumW(m: number){
  //   for(let i = 1; i <= m; i++){
  //     if(i % this.w == 0){
  //       this.n--;
  //       this.start++;
  //       console.log(`n:${this.n},start:${this.start},laststart:${this.laststart}`);
  //     }
  //     if(this.n < this.w){
  //         break;
  //       }
  //   }

  //   for(let j = this.laststart; j <= this.lastn; j++){
  //     this.sum += j;  
  //     console.log(`sum:${this.sum}`);    
  //   }
  //   this.laststart = this.start;
  // }
  // ngOnInit(){
  //   while(this.n >= this.w){
  //     this.sumW(this.n);
  //   }
  //   console.log(this.sum);
  // }
}
