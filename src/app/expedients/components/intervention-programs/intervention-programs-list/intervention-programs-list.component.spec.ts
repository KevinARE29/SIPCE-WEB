import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionProgramsListComponent } from './intervention-programs-list.component';

describe('InterventionProgramsListComponent', () => {
  let component: InterventionProgramsListComponent;
  let fixture: ComponentFixture<InterventionProgramsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionProgramsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionProgramsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
