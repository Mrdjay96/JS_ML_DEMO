import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/config';
import { timer } from 'rxjs';

declare const cv: any;
declare var Janus: any;

@Component({
    selector: 'app-bg-subtract',
    templateUrl: './bg-subtract.component.html',
    styleUrls: ['./bg-subtract.component.scss']
})

export class BgSubtractComponent implements OnInit {
    cap: any;
    frame: any;
    fgmask: any;
    bgSubtractor: any;
    videoElement: HTMLVideoElement;
    streamElement: HTMLVideoElement;
    fgCanvas: any;
    // Janus parameter
    roomId = 1234;
    username = `user-${Janus.randomString(6)}`;
    janus: any = null;
    pluginHandle: any = null;
    opaqueId = 'videoroomdemo-' + Janus.randomString(12);
    streams: any[];
    connected = false;
    // Remote and local room member
    myId = null;
    myPrivateId = null;
    myStream = null;
    
    ngOnInit() {
        this.videoElement = document.getElementById('inputVideo') as HTMLVideoElement;
        this.streamElement = document.getElementById('streamVideo') as HTMLVideoElement;
        this.fgCanvas = document.getElementById('canvas');
        this.myStream = this.fgCanvas.captureStream();
        Janus.init({
            debug: 'all',
            callback: () => {
                this.janusConnect(() => {
                    this.connected = true;
                })
            }
        });
        cv['onRuntimeInitialized'] = () => {
            console.log('Loaded OpenCV');
            this.localFileVideoPlayer();
            this.videoElement.addEventListener('play', () => {
                this.start();
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

    start () {
        this.videoElement.width = this.videoElement.videoWidth;
        this.videoElement.height = this.videoElement.videoHeight;
        this.cap = new cv.VideoCapture(this.videoElement);
        this.frame = new cv.Mat(this.videoElement.height, this.videoElement.width, cv.CV_8UC4);
        this.fgmask = new cv.Mat(this.videoElement.height, this.videoElement.width, cv.CV_8UC1);
        this.bgSubtractor = new cv.BackgroundSubtractorMOG2(1000, 16, false);
        this.processVideo();
    }

    processVideo() {
        try {
            if(!this.videoElement.currentTime || this.videoElement.paused || this.videoElement.ended) {
                return setTimeout(() => {
                    this.processVideo()
                });
                // window.cancelAnimationFrame(timer);
                // timer = window.requestAnimationFrame(processVideo.bind(this));
            }
            this.cap.read(this.frame);
            this.bgSubtractor.apply(this.frame, this.fgmask);
            // Option calculate non zero pixels 
            // console.log(cv.countNonZero(this.fgmask));
            // Option calculate contour
            let ctmask = cv.Mat.zeros(this.fgmask.rows, this.fgmask.cols, cv.CV_8UC3);
            cv.threshold(this.fgmask, this.fgmask, 120, 200, cv.THRESH_BINARY);
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();
            cv.findContours(this.fgmask, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
            for (let i = 0; i < contours.size(); i++) {
                let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255));
                cv.drawContours(ctmask, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
            }
            cv.imshow(this.fgCanvas, ctmask);
            setTimeout(() => {
                this.processVideo();
            }, 100);
            // window.cancelAnimationFrame(timer);
            // timer = window.requestAnimationFrame(processVideo.bind(this));
        } catch (err) {
            console.log(err);
        }
    }

    janusConnect(successCb: () => void) {
        if (!Janus.isWebrtcSupported()) {
            alert('Browser does not support WebRTC!');
            return;
        }

        // Create session
        this.janus = new Janus({
            server: Config.JANUS_URL,
            success: () => {
                this.janus.attach({
                    plugin: 'janus.plugin.videoroom',
                    opaqueId: this.opaqueId,
                    success: pluginHandle => {
                        this.pluginHandle = pluginHandle;
                        this.pluginHandle.send({
                            message: {
                            request: 'join',
                            room: this.roomId,
                            ptype: 'publisher',
                            display: this.username
                            }
                        });
                        successCb();
                    },
                    error: error => alert(error),
                    onmessage: (msg, jsep) => this.onJanusMessage(msg, jsep),
                    onlocalstream: stream => {
                        Janus.attachMediaStream(this.streamElement, stream);
                    },
                });
            },
            error: error => {
                alert(error);
                window.location.reload();
            },
            destroyed: () => {
                window.location.reload();
            }
        });
    }
    
    onJanusMessage(msg: any, jsep: any) {
        if (msg.error) {
            if (msg.error_code === 426) {
                alert('No such room');
            } else {
                alert(msg.error);
            }
            return;
        }

        if (msg.videoroom) {
            switch (msg.videoroom) {
                case 'joined':
                    this.myId = msg.id;
                    this.myPrivateId = msg.private_id;
                    if (msg.publishers) {
                        msg.publishers.forEach(publisher => {
                            console.log(`Add feed ${publisher.id}`);
                        });
                    }
                    this.janusPublish();
                    break;
                case 'destroyed':
                    alert('The room has been destroyed!');
                    window.location.reload();
                    break;
                case 'event':
                    if (msg.publishers) {
                        msg.publishers.forEach(publisher => {
                            console.log(`Add feed ${publisher.id}`);
                        });
                    }
                    if (msg.leaving) {
                        console.log(`Remove feed ${msg.leaving}`);
                    }
                    if (msg.unpublished) {
                    // We unpublised
                        if (msg.unpublished === 'ok') {
                            this.pluginHandle.hangup();
                            return;
                        }
                    // Someone else unpublished
                    console.log(`Remove feed ${msg.unpublished}`);
                    }
            }
        }

        if (jsep) {
            this.pluginHandle.handleRemoteJsep({
                jsep
            });
            if (
                this.myStream &&
                this.myStream.getAudioTracks() &&
                this.myStream.getAudioTracks().length > 0 &&
                !msg.audio_codec
            ) {
                alert('Audio has been rejected');
            }
            if (
                this.myStream &&
                this.myStream.getVideoTracks() &&
                this.myStream.getVideoTracks().length > 0 &&
                !msg.video_codec
            ) {
                alert('Video has been rejected');
            }
        }
    }
    
    janusPublish() {
        this.pluginHandle.createOffer({
            stream: this.myStream,
            success: jsep => {
                this.pluginHandle.send({
                    message: {
                    request: 'configure',
                    audio: false,
                    video: true
                    },
                    jsep
                });
            },
            error: error => {
                console.log(error);
            }
        });
    }
}
