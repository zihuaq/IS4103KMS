import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupDetailsTabComponent } from './edit-group-details-tab.component';

describe('EditGroupDetailsTabComponent', () => {
  let component: EditGroupDetailsTabComponent;
  let fixture: ComponentFixture<EditGroupDetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupDetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
