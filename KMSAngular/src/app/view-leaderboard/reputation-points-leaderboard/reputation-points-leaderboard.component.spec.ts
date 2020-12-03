import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReputationPointsLeaderboardComponent } from './reputation-points-leaderboard.component';

describe('ReputationPointsLeaderboardComponent', () => {
  let component: ReputationPointsLeaderboardComponent;
  let fixture: ComponentFixture<ReputationPointsLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReputationPointsLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReputationPointsLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
