import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsAndBadgesComponent } from './awards-and-badges.component';

describe('AwardsAndBadgesComponent', () => {
  let component: AwardsAndBadgesComponent;
  let fixture: ComponentFixture<AwardsAndBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardsAndBadgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardsAndBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
