import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ViewportRuler } from '@angular/cdk/overlay';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.less'
})
export class AboutComponent {
  constructor(private ViewportRuler: ViewportRuler) {

  }
  ngOnInit() {
    console.log(this.ViewportRuler.getViewportScrollPosition);
  }

}
