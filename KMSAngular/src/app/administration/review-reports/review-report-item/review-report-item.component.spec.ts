import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewReportItemComponent } from './review-report-item.component';

describe('ReviewReportItemComponent', () => {
  let component: ReviewReportItemComponent;
  let fixture: ComponentFixture<ReviewReportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewReportItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewReportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
