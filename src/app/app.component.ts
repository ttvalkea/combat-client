import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Player } from './models/Player.model';
import { Constants } from './constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public clientPlayer: Player = new Player();

  public refresher: number = 1; //This will just flicker between 1 and -1 indefinitely, ensuring DOM refreshing.
  public constants = Constants; //This is declared for Angular template to have access to constants

  constructor(public signalRService: SignalRService, private http: HttpClient) { }

  ngOnInit() {
    this.signalRService.startConnection();

    this.signalRService.addBroadcastConnectionAmountDataListener(this.clientPlayer);
    this.signalRService.addBroadcastPlayerDataMessageListener();
    this.signalRService.addBroadcastFireballDataMessageListener(this.clientPlayer);
    this.signalRService.addBroadcastFireballHitPlayerMessageListener(this.clientPlayer);
    this.signalRService.addBroadcastGetObstaclesListener(this.clientPlayer);
    this.signalRService.addNewTagListener();
    this.signalRService.addBroadcastPlayerBecomesTagListener();
    this.signalRService.addBroadcastPlayerWinsListener();

    this.startHttpRequest();

    //Refresher makes sure that clients update dom all the time
    setInterval(() => {this.refresher=this.refresher*-1}, Constants.REFRESHER_REFRESH_RATE_MS);
  }

  private startHttpRequest = () => {
    const isProductionEnvironment = environment.production;
    const serverBaseUrl = isProductionEnvironment ? 'https://tuomas-angular-combat-server.azurewebsites.net/api' : 'https://localhost:44342/api'; //'https://localhost:5001/api';
    this.http.get(serverBaseUrl + '/hub')
      .subscribe(response => {
        console.log(response);
      })
  }
}
