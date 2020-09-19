import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewUserSelectorComponent } from './create-new-user-selector.component';

describe('CreateNewUserSelectorComponent', () => {
  let component: CreateNewUserSelectorComponent;
  let fixture: ComponentFixture<CreateNewUserSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewUserSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewUserSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
