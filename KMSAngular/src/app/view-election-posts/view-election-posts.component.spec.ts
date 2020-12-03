import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewElectionPostsComponent } from './view-election-posts.component';

describe('ViewElectionPostsComponent', () => {
  let component: ViewElectionPostsComponent;
  let fixture: ComponentFixture<ViewElectionPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewElectionPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewElectionPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
