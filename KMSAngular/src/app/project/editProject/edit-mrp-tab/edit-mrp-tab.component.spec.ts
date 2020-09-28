import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMrpTabComponent } from './edit-mrp-tab.component';

describe('EditMrpTabComponent', () => {
  let component: EditMrpTabComponent;
  let fixture: ComponentFixture<EditMrpTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMrpTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMrpTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
