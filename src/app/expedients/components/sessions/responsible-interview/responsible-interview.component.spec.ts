import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleInterviewComponent } from './responsible-interview.component';

describe('ResponsibleInterviewComponent', () => {
  let component: ResponsibleInterviewComponent;
  let fixture: ComponentFixture<ResponsibleInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsibleInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibleInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
