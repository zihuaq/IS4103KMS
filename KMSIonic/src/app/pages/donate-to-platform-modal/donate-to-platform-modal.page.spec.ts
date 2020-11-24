import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DonateToPlatformModalPage } from './donate-to-platform-modal.page';

describe('DonateToPlatformModalPage', () => {
  let component: DonateToPlatformModalPage;
  let fixture: ComponentFixture<DonateToPlatformModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonateToPlatformModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DonateToPlatformModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
