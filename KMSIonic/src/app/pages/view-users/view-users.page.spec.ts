import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewUsersPage } from './view-users.page';

describe('ViewUsersPage', () => {
  let component: ViewUsersPage;
  let fixture: ComponentFixture<ViewUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUsersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
