import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageFulfillmentsModalPage } from './manage-fulfillments-modal.page';

describe('ManageFulfillmentsModalPage', () => {
  let component: ManageFulfillmentsModalPage;
  let fixture: ComponentFixture<ManageFulfillmentsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFulfillmentsModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageFulfillmentsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
