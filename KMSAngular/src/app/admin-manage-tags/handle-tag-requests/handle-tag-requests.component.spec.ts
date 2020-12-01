import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleTagRequestsComponent } from './handle-tag-requests.component';

describe('HandleTagRequestsComponent', () => {
  let component: HandleTagRequestsComponent;
  let fixture: ComponentFixture<HandleTagRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandleTagRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleTagRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
