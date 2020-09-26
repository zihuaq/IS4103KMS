import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForgetpasswordPage } from './forgetpassword.page';

describe('ForgetpasswordPage', () => {
  let component: ForgetpasswordPage;
  let fixture: ComponentFixture<ForgetpasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetpasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetpasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
