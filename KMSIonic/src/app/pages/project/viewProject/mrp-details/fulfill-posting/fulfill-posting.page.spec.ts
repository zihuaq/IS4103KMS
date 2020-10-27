import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FulfillPostingPage } from './fulfill-posting.page';

describe('FulfillPostingPage', () => {
  let component: FulfillPostingPage;
  let fixture: ComponentFixture<FulfillPostingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulfillPostingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FulfillPostingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
