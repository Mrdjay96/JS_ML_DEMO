import { Component, OnInit } from '@angular/core';
import { detectAllFaces, TinyFaceDetectorOptions, nets, SsdMobilenetv1Options, matchDimensions, resizeResults, draw } from 'face-api.js';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']   
})
export class AppComponent {
    title = "face-detection-js"
}
