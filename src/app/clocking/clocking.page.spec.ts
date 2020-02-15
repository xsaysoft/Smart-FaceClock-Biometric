import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClockingPage } from './clocking.page';

describe('ClockingPage', () => {
  let component: ClockingPage;
  let fixture: ComponentFixture<ClockingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
