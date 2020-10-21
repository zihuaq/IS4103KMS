import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportCommentModalPage } from './report-comment-modal.page';

describe('ReportCommentModalPage', () => {
  let component: ReportCommentModalPage;
  let fixture: ComponentFixture<ReportCommentModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCommentModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportCommentModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
