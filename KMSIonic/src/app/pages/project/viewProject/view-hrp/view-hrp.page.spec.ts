import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewHrpPage } from './view-hrp.page';

describe('ViewHrpPage', () => {
  let component: ViewHrpPage;
  let fixture: ComponentFixture<ViewHrpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHrpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewHrpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
