import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitematicaDetailComponent } from './litematica-detail.component';

describe('LitematicaDetailComponent', () => {
  let component: LitematicaDetailComponent;
  let fixture: ComponentFixture<LitematicaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LitematicaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LitematicaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
