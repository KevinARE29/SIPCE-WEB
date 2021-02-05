import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSessionComponent } from './student-session.component';

describe('StudentSessionComponent', () => {
  let component: StudentSessionComponent;
  let fixture: ComponentFixture<StudentSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
