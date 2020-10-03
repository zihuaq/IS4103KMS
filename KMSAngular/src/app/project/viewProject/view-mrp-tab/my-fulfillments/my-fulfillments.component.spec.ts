import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFulfillmentsComponent } from './my-fulfillments.component';

describe('MyFulfillmentsComponent', () => {
  let component: MyFulfillmentsComponent;
  let fixture: ComponentFixture<MyFulfillmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFulfillmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFulfillmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
