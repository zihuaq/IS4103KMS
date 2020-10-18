import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupErrorPageComponent } from './group-error-page.component';

describe('GroupErrorPageComponent', () => {
  let component: GroupErrorPageComponent;
  let fixture: ComponentFixture<GroupErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
