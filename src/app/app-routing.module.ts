import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaceDetectionVideoComponent } from './face-api/face-detection-video/face-detection-video.component';
import { BgSubtractComponent } from './face-api/bg-subtract/bg-subtract.component';


const routes: Routes = [
    {
        path: 'face-detection-video',
        component: FaceDetectionVideoComponent
    },
    {
        path: 'bg-subtract',
        component: BgSubtractComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
