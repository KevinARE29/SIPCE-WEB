import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientViewComponent } from './expedient-view.component';

describe('ExpedientViewComponent', () => {
  let component: ExpedientViewComponent;
  let fixture: ComponentFixture<ExpedientViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpedientViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
