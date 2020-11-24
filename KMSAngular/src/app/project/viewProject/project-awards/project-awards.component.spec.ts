import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAwardsComponent } from './project-awards.component';

describe('ProjectAwardsComponent', () => {
  let component: ProjectAwardsComponent;
  let fixture: ComponentFixture<ProjectAwardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAwardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
