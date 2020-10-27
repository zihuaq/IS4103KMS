import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportProjectPage } from './report-project.page';

describe('ReportProjectPage', () => {
  let component: ReportProjectPage;
  let fixture: ComponentFixture<ReportProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
