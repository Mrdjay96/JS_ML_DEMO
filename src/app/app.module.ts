import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceDetectionVideoModule } from './face-api/face-detection-video/face-detection-video.module';
import { NbThemeModule, NbSidebarModule, NbMenuModule, NbLayoutModule } from '@nebular/theme';
import { BgSubtractModule } from './face-api/bg-subtract/bg-subtract.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FaceDetectionVideoModule,
    BgSubtractModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
