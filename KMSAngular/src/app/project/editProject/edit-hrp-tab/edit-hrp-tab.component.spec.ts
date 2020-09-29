import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHrpTabComponent } from './edit-hrp-tab.component';

describe('EditHrpTabComponent', () => {
  let component: EditHrpTabComponent;
  let fixture: ComponentFixture<EditHrpTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHrpTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHrpTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
