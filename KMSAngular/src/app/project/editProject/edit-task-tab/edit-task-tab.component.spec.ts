import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskTabComponent } from './edit-task-tab.component';

describe('EditTaskTabComponent', () => {
  let component: EditTaskTabComponent;
  let fixture: ComponentFixture<EditTaskTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaskTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
