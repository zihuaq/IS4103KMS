import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOwnGroupComponent } from './view-own-group.component';

describe('ViewOwnGroupComponent', () => {
  let component: ViewOwnGroupComponent;
  let fixture: ComponentFixture<ViewOwnGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOwnGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOwnGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
