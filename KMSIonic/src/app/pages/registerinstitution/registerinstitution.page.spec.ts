import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterinstitutionPage } from './registerinstitution.page';

describe('RegisterinstitutionPage', () => {
  let component: RegisterinstitutionPage;
  let fixture: ComponentFixture<RegisterinstitutionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterinstitutionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterinstitutionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
