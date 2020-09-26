import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliationRequestsComponent } from './affiliation-requests.component';

describe('AffiliationRequestsComponent', () => {
  let component: AffiliationRequestsComponent;
  let fixture: ComponentFixture<AffiliationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliationRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
