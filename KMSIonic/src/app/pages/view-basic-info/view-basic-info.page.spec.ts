import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewBasicInfoPage } from './view-basic-info.page';

describe('ViewBasicInfoPage', () => {
  let component: ViewBasicInfoPage;
  let fixture: ComponentFixture<ViewBasicInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBasicInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBasicInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
