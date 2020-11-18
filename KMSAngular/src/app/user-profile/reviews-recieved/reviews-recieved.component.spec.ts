import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsRecievedComponent } from './reviews-recieved.component';

describe('ReviewsRecievedComponent', () => {
  let component: ReviewsRecievedComponent;
  let fixture: ComponentFixture<ReviewsRecievedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewsRecievedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsRecievedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
