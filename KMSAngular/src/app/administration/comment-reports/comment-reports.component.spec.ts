import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReportsComponent } from './comment-reports.component';

describe('CommentReportsComponent', () => {
  let component: CommentReportsComponent;
  let fixture: ComponentFixture<CommentReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
