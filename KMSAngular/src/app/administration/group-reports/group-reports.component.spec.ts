import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupReportsComponent } from './group-reports.component';

describe('GroupReportsComponent', () => {
  let component: GroupReportsComponent;
  let fixture: ComponentFixture<GroupReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
