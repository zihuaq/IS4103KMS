import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecommendationsComponent } from './view-recommendations.component';

describe('ViewRecommendationsComponent', () => {
  let component: ViewRecommendationsComponent;
  let fixture: ComponentFixture<ViewRecommendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRecommendationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
