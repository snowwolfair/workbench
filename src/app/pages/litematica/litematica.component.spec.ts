import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitematicaComponent } from './litematica.component';

describe('LitematicaComponent', () => {
  let component: LitematicaComponent;
  let fixture: ComponentFixture<LitematicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LitematicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LitematicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
