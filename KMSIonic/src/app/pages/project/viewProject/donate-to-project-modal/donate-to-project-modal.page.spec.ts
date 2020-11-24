import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DonateToProjectModalPage } from './donate-to-project-modal.page';

describe('DonateToProjectModalPage', () => {
  let component: DonateToProjectModalPage;
  let fixture: ComponentFixture<DonateToProjectModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonateToProjectModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DonateToProjectModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
