import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportPostModalPage } from './report-post-modal.page';

describe('ReportPostModalPage', () => {
  let component: ReportPostModalPage;
  let fixture: ComponentFixture<ReportPostModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPostModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportPostModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
