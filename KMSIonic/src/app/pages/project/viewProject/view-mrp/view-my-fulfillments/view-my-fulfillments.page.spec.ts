import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewMyFulfillmentsPage } from './view-my-fulfillments.page';

describe('ViewMyFulfillmentsPage', () => {
  let component: ViewMyFulfillmentsPage;
  let fixture: ComponentFixture<ViewMyFulfillmentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMyFulfillmentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMyFulfillmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
