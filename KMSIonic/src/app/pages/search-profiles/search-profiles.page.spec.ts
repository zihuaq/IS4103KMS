import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchProfilesPage } from './search-profiles.page';

describe('SearchProfilesPage', () => {
  let component: SearchProfilesPage;
  let fixture: ComponentFixture<SearchProfilesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchProfilesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchProfilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
