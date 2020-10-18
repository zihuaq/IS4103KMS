import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersTabComponent } from './group-members-tab.component';

describe('GroupMembersTabComponent', () => {
  let component: GroupMembersTabComponent;
  let fixture: ComponentFixture<GroupMembersTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMembersTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMembersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
