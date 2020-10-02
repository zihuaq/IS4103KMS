import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPanelPage } from './tab-panel.page';

describe('TabPanelPage', () => {
  let component: TabPanelPage;
  let fixture: ComponentFixture<TabPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
