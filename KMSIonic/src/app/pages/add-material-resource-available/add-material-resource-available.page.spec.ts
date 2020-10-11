import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMaterialResourceAvailablePage } from './add-material-resource-available.page';

describe('AddMaterialResourceAvailablePage', () => {
  let component: AddMaterialResourceAvailablePage;
  let fixture: ComponentFixture<AddMaterialResourceAvailablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaterialResourceAvailablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMaterialResourceAvailablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
