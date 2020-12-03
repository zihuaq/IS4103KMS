import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateFulfillmentModalPage } from './update-fulfillment-modal.page';

describe('UpdateFulfillmentModalPage', () => {
  let component: UpdateFulfillmentModalPage;
  let fixture: ComponentFixture<UpdateFulfillmentModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFulfillmentModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateFulfillmentModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
