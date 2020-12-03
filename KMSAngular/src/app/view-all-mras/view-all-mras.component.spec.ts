import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllMrasComponent } from './view-all-mras.component';

describe('ViewAllMrasComponent', () => {
  let component: ViewAllMrasComponent;
  let fixture: ComponentFixture<ViewAllMrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllMrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllMrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
