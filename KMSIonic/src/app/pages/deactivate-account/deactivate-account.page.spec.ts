import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeactivateAccountPage } from './deactivate-account.page';

describe('DeactivateAccountPage', () => {
  let component: DeactivateAccountPage;
  let fixture: ComponentFixture<DeactivateAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivateAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
