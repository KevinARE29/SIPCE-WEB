import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsAssignmentComponent } from './students-assignment.component';

describe('StudentsAssignmentComponent', () => {
  let component: StudentsAssignmentComponent;
  let fixture: ComponentFixture<StudentsAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsAssignmentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
