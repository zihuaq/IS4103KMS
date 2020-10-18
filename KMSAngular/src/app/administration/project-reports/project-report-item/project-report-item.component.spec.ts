import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReportItemComponent } from './project-report-item.component';

describe('ProjectReportItemComponent', () => {
  let component: ProjectReportItemComponent;
  let fixture: ComponentFixture<ProjectReportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectReportItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectReportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
