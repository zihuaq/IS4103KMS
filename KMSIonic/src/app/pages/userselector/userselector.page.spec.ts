import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserselectorPage } from './userselector.page';

describe('UserselectorPage', () => {
  let component: UserselectorPage;
  let fixture: ComponentFixture<UserselectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserselectorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserselectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
