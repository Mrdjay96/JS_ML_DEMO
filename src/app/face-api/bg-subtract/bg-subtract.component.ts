import { Component, OnInit } from '@angular/core';

declare const cv: any;

@Component({
    selector: 'app-bg-subtract',
    templateUrl: './bg-subtract.component.html',
    styleUrls: ['./bg-subtract.component.scss']
})

export class BgSubtractComponent implements OnInit {

    // cv = require('../../../assets/opencv.js');

    ngOnInit() {
        const videoElement = document.getElementById('inputVideo') as HTMLVideoElement;
        cv['onRuntimeInitialized'] = () => {
            console.log('Loaded OpenCV');
            this.localFileVideoPlayer();
            videoElement.addEventListener('play', () => {
                this.start(videoElement);
            })
        }
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

    start (videoElement) {
        videoElement.width = videoElement.videoWidth;
        videoElement.height = videoElement.videoHeight;
        let cap = new cv.VideoCapture(videoElement);
        let frame = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
        console.log(frame.size())
        let fgmask = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC1);
        let bgSubtractor = new cv.BackgroundSubtractorMOG2(500, 16, true);
        const canvas = document.getElementById('overlay') as HTMLCanvasElement;
        const FPS = 30;
        function processVideo() {
            try {
                if(!videoElement.currentTime || videoElement.paused || videoElement.ended) {
                    return setTimeout(processVideo);
                }
                let begin = Date.now();
                console.log('Start reading...');
                cap.read(frame);
                console.log('Readed frame');
                bgSubtractor.apply(frame, fgmask);
                console.log('Subtracted background');
                this.cv.imshow(canvas, fgmask);
                let delay = 1000/FPS - (Date.now() - begin);
                setTimeout(processVideo, delay);
            } catch (err) {
                console.log(err);
            }
        }
        setTimeout(processVideo, 0);
    }
}
