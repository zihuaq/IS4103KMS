import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateToPlatformComponent } from './donate-to-platform.component';

describe('DonateToPlatformComponent', () => {
  let component: DonateToPlatformComponent;
  let fixture: ComponentFixture<DonateToPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonateToPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateToPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
