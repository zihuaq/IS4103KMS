import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsWrittenComponent } from './reviews-written.component';

describe('ReviewsWrittenComponent', () => {
  let component: ReviewsWrittenComponent;
  let fixture: ComponentFixture<ReviewsWrittenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewsWrittenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsWrittenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
