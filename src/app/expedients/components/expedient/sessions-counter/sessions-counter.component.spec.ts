import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsCounterComponent } from './sessions-counter.component';

describe('SessionsCounterComponent', () => {
  let component: SessionsCounterComponent;
  let fixture: ComponentFixture<SessionsCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SessionsCounterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
