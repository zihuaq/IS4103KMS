import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageElectionsComponent } from './admin-manage-elections.component';

describe('AdminManageElectionsComponent', () => {
  let component: AdminManageElectionsComponent;
  let fixture: ComponentFixture<AdminManageElectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageElectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageElectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
