import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MrpRecommendationsModalPage } from './mrp-recommendations-modal.page';

describe('MrpRecommendationsModalPage', () => {
  let component: MrpRecommendationsModalPage;
  let fixture: ComponentFixture<MrpRecommendationsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrpRecommendationsModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MrpRecommendationsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
