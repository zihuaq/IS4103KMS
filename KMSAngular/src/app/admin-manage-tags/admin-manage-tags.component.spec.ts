import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageTagsComponent } from './admin-manage-tags.component';

describe('AdminManageTagsComponent', () => {
  let component: AdminManageTagsComponent;
  let fixture: ComponentFixture<AdminManageTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
