import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionsBankComponent } from './create-question-bank.component';

describe('CreateQuestionsBanksComponent', () => {
  let component: CreateQuestionBankComponent;
  let fixture: ComponentFixture<CreateQuestionBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionBankComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
