import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestionBankComponent } from './edit-question-bank.component';

describe('EditQuestionsBanksComponent', () => {
  let component: EditQuestionBankComponent;
  let fixture: ComponentFixture<EditQuestionBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditQuestionBankComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
