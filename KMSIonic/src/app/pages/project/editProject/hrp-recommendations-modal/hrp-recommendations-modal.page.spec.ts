import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HrpRecommendationsModalPage } from './hrp-recommendations-modal.page';

describe('HrpRecommendationsModalPage', () => {
  let component: HrpRecommendationsModalPage;
  let fixture: ComponentFixture<HrpRecommendationsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrpRecommendationsModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HrpRecommendationsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
