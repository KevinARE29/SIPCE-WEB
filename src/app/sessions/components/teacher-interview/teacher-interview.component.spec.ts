import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherInterviewComponent } from './teacher-interview.component';

describe('TeacherInterviewComponent', () => {
  let component: TeacherInterviewComponent;
  let fixture: ComponentFixture<TeacherInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
