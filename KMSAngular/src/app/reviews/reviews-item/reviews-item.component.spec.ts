import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsItemComponent } from './reviews-item.component';

describe('ReviewsItemComponent', () => {
  let component: ReviewsItemComponent;
  let fixture: ComponentFixture<ReviewsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
