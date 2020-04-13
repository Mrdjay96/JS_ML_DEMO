import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BgSubtractComponent } from './bg-subtract.component';

describe('BgSubtractComponent', () => {
  let component: BgSubtractComponent;
  let fixture: ComponentFixture<BgSubtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgSubtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgSubtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
