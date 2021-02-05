import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSociometricTestComponent } from './student-sociometric-test.component';

describe('StudentSociometricTestComponent', () => {
  let component: StudentSociometricTestComponent;
  let fixture: ComponentFixture<StudentSociometricTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentSociometricTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSociometricTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
