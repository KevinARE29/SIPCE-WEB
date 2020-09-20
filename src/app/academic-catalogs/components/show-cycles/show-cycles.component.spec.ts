import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCyclesComponent } from './show-cycles.component';

describe('ShowCyclesComponent', () => {
  let component: ShowCyclesComponent;
  let fixture: ComponentFixture<ShowCyclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCyclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCyclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
