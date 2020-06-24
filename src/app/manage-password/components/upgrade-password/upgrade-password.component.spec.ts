import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradePasswordComponent } from './upgrade-password.component';

describe('UpgradePasswordComponent', () => {
  let component: UpgradePasswordComponent;
  let fixture: ComponentFixture<UpgradePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
