import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFoulsSanctionsComponent } from './history-fouls-sanctions.component';

describe('HistoryFoulsSanctionsComponent', () => {
  let component: HistoryFoulsSanctionsComponent;
  let fixture: ComponentFixture<HistoryFoulsSanctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryFoulsSanctionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryFoulsSanctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
