import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewInstitutionComponent } from './create-new-institution.component';

describe('CreateNewInstitutionComponent', () => {
  let component: CreateNewInstitutionComponent;
  let fixture: ComponentFixture<CreateNewInstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewInstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
