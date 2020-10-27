import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupReportItemComponent } from './group-report-item.component';

describe('GroupReportItemComponent', () => {
  let component: GroupReportItemComponent;
  let fixture: ComponentFixture<GroupReportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupReportItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupReportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
