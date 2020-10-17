import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditHrpPage } from './edit-hrp.page';

describe('EditHrpPage', () => {
  let component: EditHrpPage;
  let fixture: ComponentFixture<EditHrpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHrpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditHrpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
