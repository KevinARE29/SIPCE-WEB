import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeClosureComponent } from './grade-closure.component';

describe('GradeClosureComponent', () => {
  let component: GradeClosureComponent;
  let fixture: ComponentFixture<GradeClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
