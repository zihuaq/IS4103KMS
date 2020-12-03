import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyProjectLeaderboardComponent } from './weekly-project-leaderboard.component';

describe('WeeklyProjectLeaderboardComponent', () => {
  let component: WeeklyProjectLeaderboardComponent;
  let fixture: ComponentFixture<WeeklyProjectLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyProjectLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyProjectLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
