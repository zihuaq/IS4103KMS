import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMrpTabComponent } from './view-mrp-tab.component';

describe('ViewMrpTabComponent', () => {
  let component: ViewMrpTabComponent;
  let fixture: ComponentFixture<ViewMrpTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMrpTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMrpTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
