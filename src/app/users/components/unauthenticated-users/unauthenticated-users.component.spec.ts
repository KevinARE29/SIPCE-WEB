import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthenticatedUsersComponent } from './unauthenticated-users.component';

describe('UnauthenticatedUsersComponent', () => {
  let component: UnauthenticatedUsersComponent;
  let fixture: ComponentFixture<UnauthenticatedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthenticatedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthenticatedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
