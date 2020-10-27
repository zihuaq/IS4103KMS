import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateHrpPage } from './create-hrp.page';

describe('CreateHrpPage', () => {
  let component: CreateHrpPage;
  let fixture: ComponentFixture<CreateHrpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHrpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateHrpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
