import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaterialResourceAvailableComponent } from './material-resource-available.component';

describe('MaterialResourceAvailableComponent', () => {
  let component: MaterialResourceAvailableComponent;
  let fixture: ComponentFixture<MaterialResourceAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialResourceAvailableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialResourceAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
