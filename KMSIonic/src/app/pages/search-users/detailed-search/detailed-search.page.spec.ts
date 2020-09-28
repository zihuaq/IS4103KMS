import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailedSearchPage } from './detailed-search.page';

describe('DetailedSearchPage', () => {
  let component: DetailedSearchPage;
  let fixture: ComponentFixture<DetailedSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
