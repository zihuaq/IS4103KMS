import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewElectionPostsPage } from './view-election-posts.page';

describe('ViewElectionPostsPage', () => {
  let component: ViewElectionPostsPage;
  let fixture: ComponentFixture<ViewElectionPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewElectionPostsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewElectionPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
