import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharePostModalPage } from './share-post-modal.page';

describe('SharePostModalPage', () => {
  let component: SharePostModalPage;
  let fixture: ComponentFixture<SharePostModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePostModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharePostModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
