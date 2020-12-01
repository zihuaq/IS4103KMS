import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileClaimsComponent } from './profile-claims.component';

describe('ProfileClaimsComponent', () => {
  let component: ProfileClaimsComponent;
  let fixture: ComponentFixture<ProfileClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
