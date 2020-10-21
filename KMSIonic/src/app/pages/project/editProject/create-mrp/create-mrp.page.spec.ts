import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMrpPage } from './create-mrp.page';

describe('CreateMrpPage', () => {
  let component: CreateMrpPage;
  let fixture: ComponentFixture<CreateMrpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMrpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMrpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
