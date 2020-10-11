import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFulfillmentsComponent } from './manage-fulfillments.component';

describe('ManageFulfillmentsComponent', () => {
  let component: ManageFulfillmentsComponent;
  let fixture: ComponentFixture<ManageFulfillmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFulfillmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFulfillmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
