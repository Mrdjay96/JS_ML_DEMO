import { Component, OnInit } from '@angular/core';
import { detectAllFaces, TinyFaceDetectorOptions, nets, SsdMobilenetv1Options, matchDimensions, resizeResults, draw } from 'face-api.js';

@Component({
  selector: 'app-face-detection-video',
  templateUrl: './face-detection-video.component.html',
  styleUrls: ['./face-detection-video.component.scss']
})
export class FaceDetectionVideoComponent implements OnInit {

  videoElement: HTMLVideoElement;
  net = nets.ssdMobilenetv1.loadFromUri('assets/weights');

  ngOnInit() {
      this.localFileVideoPlayer();
      this.start();
  }

  localFileVideoPlayer () {  
      const URL = window.URL || window.webkitURL;
      let playSelectedFile = function(event) {
          const file = event.target.files[0];
          const type = file.type;
          const videoNode = document.querySelector('video');
          const fileURL = URL.createObjectURL(file);
          videoNode.src = fileURL;
      }
      const inputNode = document.querySelector('input')
      inputNode.addEventListener('change', playSelectedFile, false)
  }

  getCurrentFaceDetectionNet() {
      return nets.ssdMobilenetv1;
  }

  isFaceDetectionModelLoaded() {
      return !!this.getCurrentFaceDetectionNet().params;
  }

  async start () {
      await nets.ssdMobilenetv1.loadFromUri('assets/weights');
      const videoElement = document.getElementById('inputVideo') as HTMLVideoElement;
      this.onPlay(videoElement);
  }

  async onPlay(videoElement) {
      if(!videoElement.currentTime || videoElement.paused || videoElement.ended || !this.isFaceDetectionModelLoaded())
          return setTimeout(() => this.onPlay(videoElement));
      let detectTask = detectAllFaces(videoElement, new SsdMobilenetv1Options);
      const results = await detectTask;
      const canvas = document.getElementById('overlay') as HTMLCanvasElement;
      const dims = matchDimensions(canvas, videoElement, true);
      const resizedResults = resizeResults(results, dims);
      draw.drawDetections(canvas, resizedResults);
      setTimeout(() => this.onPlay(videoElement))
  }
}
