import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReportItemComponent } from './comment-report-item.component';

describe('CommentReportItemComponent', () => {
  let component: CommentReportItemComponent;
  let fixture: ComponentFixture<CommentReportItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentReportItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentReportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
