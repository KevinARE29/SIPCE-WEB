import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeDocumentComponent } from './large-document.component';

describe('LargeDocumentComponent', () => {
  let component: LargeDocumentComponent;
  let fixture: ComponentFixture<LargeDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargeDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
