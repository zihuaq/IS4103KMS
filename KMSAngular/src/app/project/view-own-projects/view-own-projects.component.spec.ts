import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOwnProjectsComponent } from './view-own-projects.component';

describe('ViewOwnProjectsComponent', () => {
  let component: ViewOwnProjectsComponent;
  let fixture: ComponentFixture<ViewOwnProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOwnProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOwnProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
