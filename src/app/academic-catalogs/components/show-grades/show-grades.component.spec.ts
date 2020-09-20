import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGradesComponent } from './show-grades.component';

describe('ShowGradesComponent', () => {
  let component: ShowGradesComponent;
  let fixture: ComponentFixture<ShowGradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowGradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
