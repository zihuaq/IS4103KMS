import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateToProjectComponent } from './donate-to-project.component';

describe('DonateToProjectComponent', () => {
  let component: DonateToProjectComponent;
  let fixture: ComponentFixture<DonateToProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonateToProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateToProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
