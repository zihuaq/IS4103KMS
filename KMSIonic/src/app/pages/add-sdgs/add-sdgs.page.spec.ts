import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSdgsPage } from './add-sdgs.page';

describe('AddSdgsPage', () => {
  let component: AddSdgsPage;
  let fixture: ComponentFixture<AddSdgsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSdgsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSdgsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
