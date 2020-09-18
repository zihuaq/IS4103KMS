import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveAllUsersComponent } from './retrieve-all-users.component';

describe('RetrieveAllUsersComponent', () => {
  let component: RetrieveAllUsersComponent;
  let fixture: ComponentFixture<RetrieveAllUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrieveAllUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveAllUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
