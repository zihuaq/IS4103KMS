import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewMrpPage } from './view-mrp.page';

describe('ViewMrpPage', () => {
  let component: ViewMrpPage;
  let fixture: ComponentFixture<ViewMrpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMrpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMrpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
