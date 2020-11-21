import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRecommendationsComponent } from './project-recommendations.component';

describe('ProjectRecommendationsComponent', () => {
  let component: ProjectRecommendationsComponent;
  let fixture: ComponentFixture<ProjectRecommendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRecommendationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
