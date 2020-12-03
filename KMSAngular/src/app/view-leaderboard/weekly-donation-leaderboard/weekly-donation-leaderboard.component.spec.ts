import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyDonationLeaderboardComponent } from './weekly-donation-leaderboard.component';

describe('WeeklyDonationLeaderboardComponent', () => {
  let component: WeeklyDonationLeaderboardComponent;
  let fixture: ComponentFixture<WeeklyDonationLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyDonationLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyDonationLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
