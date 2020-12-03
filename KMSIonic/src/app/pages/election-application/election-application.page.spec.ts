import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ElectionApplicationPage } from './election-application.page';

describe('ElectionApplicationPage', () => {
  let component: ElectionApplicationPage;
  let fixture: ComponentFixture<ElectionApplicationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectionApplicationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionApplicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
