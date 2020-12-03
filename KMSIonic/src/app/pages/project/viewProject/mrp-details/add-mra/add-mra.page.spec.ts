import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMraPage } from './add-mra.page';

describe('AddMraPage', () => {
  let component: AddMraPage;
  let fixture: ComponentFixture<AddMraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
