import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostReportItemComponent } from './post-report-item.component';

describe('PostReportItemComponent', () => {
  let component: PostReportItemComponent;
  let fixture: ComponentFixture<PostReportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostReportItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostReportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
