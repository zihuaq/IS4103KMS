import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivityTabComponent } from './edit-activity-tab.component';

describe('EditActivityTabComponent', () => {
  let component: EditActivityTabComponent;
  let fixture: ComponentFixture<EditActivityTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditActivityTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditActivityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
