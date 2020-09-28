import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialResourcePostingTabComponent } from './material-resource-posting-tab.component';

describe('MaterialResourcePostingTabComponent', () => {
  let component: MaterialResourcePostingTabComponent;
  let fixture: ComponentFixture<MaterialResourcePostingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialResourcePostingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialResourcePostingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
