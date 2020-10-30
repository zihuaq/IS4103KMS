import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportGroupPage } from './report-group.page';

describe('ReportGroupPage', () => {
  let component: ReportGroupPage;
  let fixture: ComponentFixture<ReportGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportGroupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
