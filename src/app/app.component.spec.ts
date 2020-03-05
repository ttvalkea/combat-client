import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { ServerControlsComponent } from './components/server-controls/server-controls.component';
import { StatIndicatorsComponent } from './components/stat-indicators/stat-indicators.component';
import { PlayAreaComponent } from './components/play-area/play-area.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
    }).compileComponents();
  }));

  it('should create the app', () => {
    console.log('heiii------')
    console.log(AppComponent)
    console.log('------------^^AppComponent')
    //Tässä hajoaa
    const fixture = TestBed.createComponent(AppComponent);
    console.log('fixtureeeee------')
    console.log(fixture)
    console.log('fixtureeeeee^^^^^----')
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render refresher', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.refresher').textContent).toContain('1');
  });
});
