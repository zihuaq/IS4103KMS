import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSimilarProjectsComponent } from './view-similar-projects.component';

describe('ViewSimilarProjectsComponent', () => {
  let component: ViewSimilarProjectsComponent;
  let fixture: ComponentFixture<ViewSimilarProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSimilarProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSimilarProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
