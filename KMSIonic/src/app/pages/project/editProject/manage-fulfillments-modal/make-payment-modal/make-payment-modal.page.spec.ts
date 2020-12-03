import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MakePaymentModalPage } from './make-payment-modal.page';

describe('MakePaymentModalPage', () => {
  let component: MakePaymentModalPage;
  let fixture: ComponentFixture<MakePaymentModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePaymentModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MakePaymentModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
