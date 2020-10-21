import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserSettingPage } from './user-setting.page';

describe('UserSettingPage', () => {
  let component: UserSettingPage;
  let fixture: ComponentFixture<UserSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSettingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
