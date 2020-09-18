import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllProjectComponent } from './view-all-project.component';

describe('ViewAllProjectComponent', () => {
  let component: ViewAllProjectComponent;
  let fixture: ComponentFixture<ViewAllProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
