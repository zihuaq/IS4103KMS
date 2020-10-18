import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllGroupComponent } from './view-all-group.component';

describe('ViewAllGroupComponent', () => {
  let component: ViewAllGroupComponent;
  let fixture: ComponentFixture<ViewAllGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
