import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewOwnGroupsPage } from './view-own-groups.page';

describe('ViewOwnGroupsPage', () => {
  let component: ViewOwnGroupsPage;
  let fixture: ComponentFixture<ViewOwnGroupsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOwnGroupsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOwnGroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
