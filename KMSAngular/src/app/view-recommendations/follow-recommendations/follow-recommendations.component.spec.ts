import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowRecommendationsComponent } from './follow-recommendations.component';

describe('FollowRecommendationsComponent', () => {
  let component: FollowRecommendationsComponent;
  let fixture: ComponentFixture<FollowRecommendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowRecommendationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
