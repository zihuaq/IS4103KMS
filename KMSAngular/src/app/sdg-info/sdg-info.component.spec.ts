import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdgInfoComponent } from './sdg-info.component';

describe('SdgInfoComponent', () => {
  let component: SdgInfoComponent;
  let fixture: ComponentFixture<SdgInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdgInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
