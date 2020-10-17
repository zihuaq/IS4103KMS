import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPostCommentModalPage } from './edit-post-comment-modal.page';

describe('EditPostCommentModalPage', () => {
  let component: EditPostCommentModalPage;
  let fixture: ComponentFixture<EditPostCommentModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPostCommentModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostCommentModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
