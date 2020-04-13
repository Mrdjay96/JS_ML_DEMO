import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceDetectionVideoComponent } from './face-detection-video.component';

describe('FaceDetectionVideoComponent', () => {
  let component: FaceDetectionVideoComponent;
  let fixture: ComponentFixture<FaceDetectionVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceDetectionVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceDetectionVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
