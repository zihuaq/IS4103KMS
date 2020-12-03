import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllMrpsComponent } from './view-all-mrps.component';

describe('ViewAllMrpsComponent', () => {
  let component: ViewAllMrpsComponent;
  let fixture: ComponentFixture<ViewAllMrpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllMrpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllMrpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
