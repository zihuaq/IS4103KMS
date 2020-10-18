import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReportItemComponent } from './profile-report-item.component';

describe('ProfileReportItemComponent', () => {
  let component: ProfileReportItemComponent;
  let fixture: ComponentFixture<ProfileReportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileReportItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
