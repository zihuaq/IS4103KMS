import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SDGsComponent } from './sdgs.component';

describe('SDGsComponent', () => {
  let component: SDGsComponent;
  let fixture: ComponentFixture<SDGsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SDGsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SDGsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
