import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfilesComponent } from './upload-profiles.component';

describe('UploadProfilesComponent', () => {
  let component: UploadProfilesComponent;
  let fixture: ComponentFixture<UploadProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
