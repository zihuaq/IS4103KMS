import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewSdgsPage } from './view-sdgs.page';

describe('ViewSdgsPage', () => {
  let component: ViewSdgsPage;
  let fixture: ComponentFixture<ViewSdgsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSdgsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSdgsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
