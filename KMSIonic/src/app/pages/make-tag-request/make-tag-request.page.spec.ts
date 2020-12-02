import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MakeTagRequestPage } from './make-tag-request.page';

describe('MakeTagRequestPage', () => {
  let component: MakeTagRequestPage;
  let fixture: ComponentFixture<MakeTagRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeTagRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MakeTagRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
