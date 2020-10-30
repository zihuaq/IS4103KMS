import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadDocPage } from './upload-doc.page';

describe('UploadDocPage', () => {
  let component: UploadDocPage;
  let fixture: ComponentFixture<UploadDocPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadDocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
