import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsAndBadgeComponent } from './awards-and-badge.component';

describe('AwardsAndBadgeComponent', () => {
  let component: AwardsAndBadgeComponent;
  let fixture: ComponentFixture<AwardsAndBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardsAndBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardsAndBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
