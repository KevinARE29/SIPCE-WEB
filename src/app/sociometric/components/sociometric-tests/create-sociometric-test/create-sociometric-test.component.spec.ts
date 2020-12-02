import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSociometricTestComponent } from './create-sociometric-test.component';

describe('CreateSociometricTestComponent', () => {
  let component: CreateSociometricTestComponent;
  let fixture: ComponentFixture<CreateSociometricTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSociometricTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSociometricTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
