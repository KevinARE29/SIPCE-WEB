import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTypeComponent } from './session-type.component';

describe('SessionTypeComponent', () => {
  let component: SessionTypeComponent;
  let fixture: ComponentFixture<SessionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
