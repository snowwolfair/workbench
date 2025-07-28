import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentItem } from '../component-list/component-list.component';

@Component({
  selector: 'app-component-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-detail.component.html',
  styleUrls: ['./component-detail.component.css']
})
export class ComponentDetailComponent {
  @Input() component: ComponentItem | null = null;
  @Output() closeDetailEvent = new EventEmitter<void>();
  @Output() viewOnMapEvent = new EventEmitter<ComponentItem>();
  @Output() downloadEvent = new EventEmitter<ComponentItem>();
  @Output() deleteEvent = new EventEmitter<ComponentItem>();

  closeDetail() {
    this.closeDetailEvent.emit();
  }

  viewOnMap() {
    if (this.component) {
      this.viewOnMapEvent.emit(this.component);
    }
  }

  downloadComponent() {
    if (this.component) {
      this.downloadEvent.emit(this.component);
    }
  }

  deleteComponent() {
    if (this.component) {
      this.deleteEvent.emit(this.component);
    }
  }
}
