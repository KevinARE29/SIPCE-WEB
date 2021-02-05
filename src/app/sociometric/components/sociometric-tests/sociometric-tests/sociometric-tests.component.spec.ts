import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SociometricTestsComponent } from './sociometric-tests.component';

describe('SociometricTestsComponent', () => {
  let component: SociometricTestsComponent;
  let fixture: ComponentFixture<SociometricTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SociometricTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SociometricTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
