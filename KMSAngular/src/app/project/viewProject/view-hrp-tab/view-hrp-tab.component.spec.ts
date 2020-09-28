import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHrpTabComponent } from './view-hrp-tab.component';

describe('ViewHrpTabComponent', () => {
  let component: ViewHrpTabComponent;
  let fixture: ComponentFixture<ViewHrpTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHrpTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHrpTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
