import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsBanksComponent } from './questions-banks.component';

describe('QuestionsBanksComponent', () => {
  let component: QuestionsBanksComponent;
  let fixture: ComponentFixture<QuestionsBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsBanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
