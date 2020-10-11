import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateNewProjectPage } from './create-new-project.page';

describe('CreateNewProjectPage', () => {
  let component: CreateNewProjectPage;
  let fixture: ComponentFixture<CreateNewProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
