import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSectionsComponent } from './show-sections.component';

describe('ShowSectionsComponent', () => {
  let component: ShowSectionsComponent;
  let fixture: ComponentFixture<ShowSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
