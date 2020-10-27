import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMraModalPage } from './add-mra-modal.page';

describe('AddMraModalPage', () => {
  let component: AddMraModalPage;
  let fixture: ComponentFixture<AddMraModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMraModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMraModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
