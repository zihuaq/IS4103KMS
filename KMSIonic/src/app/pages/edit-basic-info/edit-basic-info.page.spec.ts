import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditBasicInfoPage } from './edit-basic-info.page';

describe('EditBasicInfoPage', () => {
  let component: EditBasicInfoPage;
  let fixture: ComponentFixture<EditBasicInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBasicInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditBasicInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
