import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SociometricTestComponent } from './sociometric-test.component';

describe('SociometricTestComponent', () => {
  let component: SociometricTestComponent;
  let fixture: ComponentFixture<SociometricTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SociometricTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SociometricTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
