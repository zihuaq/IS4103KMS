import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostCommentModalPage } from './post-comment-modal.page';

describe('PostCommentModalPage', () => {
  let component: PostCommentModalPage;
  let fixture: ComponentFixture<PostCommentModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCommentModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostCommentModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
