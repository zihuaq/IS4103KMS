import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchUsersPage } from './search-users.page';

describe('SearchUsersPage', () => {
  let component: SearchUsersPage;
  let fixture: ComponentFixture<SearchUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUsersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
