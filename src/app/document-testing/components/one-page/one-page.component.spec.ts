import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnePageComponent } from './one-page.component';

describe('OnePageComponent', () => {
  let component: OnePageComponent;
  let fixture: ComponentFixture<OnePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
