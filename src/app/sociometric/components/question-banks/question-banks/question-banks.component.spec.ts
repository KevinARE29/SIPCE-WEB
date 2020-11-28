import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBanksComponent } from './question-banks.component';

describe('QuestionsBanksComponent', () => {
  let component: QuestionBanksComponent;
  let fixture: ComponentFixture<QuestionBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionBanksComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
