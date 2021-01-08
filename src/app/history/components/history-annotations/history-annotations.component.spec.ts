import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAnnotationsComponent } from './history-annotations.component';

describe('HistoryAnnotationsComponent', () => {
  let component: HistoryAnnotationsComponent;
  let fixture: ComponentFixture<HistoryAnnotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryAnnotationsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
