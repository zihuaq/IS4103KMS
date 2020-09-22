import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTabComponent } from './details-tab.component';

describe('DetailsTabComponent', () => {
  let component: DetailsTabComponent;
  let fixture: ComponentFixture<DetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
