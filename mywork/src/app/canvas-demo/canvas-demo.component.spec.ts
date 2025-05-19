import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDemoComponent } from './canvas-demo.component';

describe('CanvasDemoComponent', () => {
  let component: CanvasDemoComponent;
  let fixture: ComponentFixture<CanvasDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
