import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingDetailsModalComponent } from './drawing-details-modal.component';

describe('DrawingDetailsModalComponent', () => {
  let component: DrawingDetailsModalComponent;
  let fixture: ComponentFixture<DrawingDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawingDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
