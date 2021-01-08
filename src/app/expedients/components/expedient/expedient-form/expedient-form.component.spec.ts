import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientFormComponent } from './expedient-form.component';

describe('ExpedientFormComponent', () => {
  let component: ExpedientFormComponent;
  let fixture: ComponentFixture<ExpedientFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpedientFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
