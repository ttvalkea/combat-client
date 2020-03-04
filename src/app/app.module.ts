import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { ServerControlsComponent } from './components/server-controls/server-controls.component';
import { StatIndicatorsComponent } from './components/stat-indicators/stat-indicators.component';
import { PlayAreaComponent } from './components/play-area/play-area.component';

@NgModule({
  declarations: [
    AppComponent,
    InstructionsComponent,
    ServerControlsComponent,
    StatIndicatorsComponent,
    PlayAreaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
