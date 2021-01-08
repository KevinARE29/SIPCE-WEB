import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselingRequestsComponent } from './counseling-requests.component';

describe('CounselingRequestsComponent', () => {
  let component: CounselingRequestsComponent;
  let fixture: ComponentFixture<CounselingRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounselingRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounselingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
