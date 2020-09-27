import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SdgInfoPage } from './sdg-info.page';

describe('SdgInfoPage', () => {
  let component: SdgInfoPage;
  let fixture: ComponentFixture<SdgInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdgInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SdgInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
