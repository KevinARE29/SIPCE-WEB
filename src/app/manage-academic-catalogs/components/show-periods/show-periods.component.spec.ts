import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPeriodsComponent } from './show-periods.component';

describe('ShowPeriodsComponent', () => {
  let component: ShowPeriodsComponent;
  let fixture: ComponentFixture<ShowPeriodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPeriodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
