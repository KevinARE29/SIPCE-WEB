import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionProgramsFormComponent } from './intervention-programs-form.component';

describe('InterventionProgramsFormComponent', () => {
  let component: InterventionProgramsFormComponent;
  let fixture: ComponentFixture<InterventionProgramsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionProgramsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionProgramsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
