import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeaderboardComponent } from './view-leaderboard.component';

describe('ViewLeaderboardComponent', () => {
  let component: ViewLeaderboardComponent;
  let fixture: ComponentFixture<ViewLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
