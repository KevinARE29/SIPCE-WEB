import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestionsBanksComponent } from './edit-questions-banks.component';

describe('EditQuestionsBanksComponent', () => {
  let component: EditQuestionsBanksComponent;
  let fixture: ComponentFixture<EditQuestionsBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQuestionsBanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionsBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
