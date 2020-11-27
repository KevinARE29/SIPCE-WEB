import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionsBanksComponent } from './create-questions-banks.component';

describe('CreateQuestionsBanksComponent', () => {
  let component: CreateQuestionsBanksComponent;
  let fixture: ComponentFixture<CreateQuestionsBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionsBanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionsBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
