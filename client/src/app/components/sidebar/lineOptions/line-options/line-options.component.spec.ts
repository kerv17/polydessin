import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineOptionsComponent } from './line-options.component';

describe('LineOptionsComponent', () => {
  let component: LineOptionsComponent;
  let fixture: ComponentFixture<LineOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
