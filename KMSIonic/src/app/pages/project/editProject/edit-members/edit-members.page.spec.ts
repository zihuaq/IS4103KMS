import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditMembersPage } from './edit-members.page';

describe('EditMembersPage', () => {
  let component: EditMembersPage;
  let fixture: ComponentFixture<EditMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMembersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
