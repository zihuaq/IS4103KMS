import { async, ComponentFixture, TestBed } from "@angular/core/testing"
import { IonicModule } from "@ionic/angular"

import { AddSkillsPage } from "./add-skills.page"

describe("AddSkillsPage", () => {
  let component: AddSkillsPage
  let fixture: ComponentFixture<AddSkillsPage>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSkillsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents()

    fixture = TestBed.createComponent(AddSkillsPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
