import { Component, OnInit, HostListener } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { getRandomNumber, getRandomPlayerColor, generateId } from './utils/utils';
import { Player } from './models/Player.model';
import { Fireball } from './models/Fireball.model';
import { Constants } from './constants/constants';


//TODO: Refactor different entities into their own files (Player etc)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public clientPlayer: Player = new Player();
  public refresher: number = 1; //This will just flick between 1 and -1 indefinitely, ensuring DOM refreshing.
  public constants = Constants; //This is declared for Angular template to have access to constants

  constructor(public signalRService: SignalRService, private http: HttpClient) {
    this.clientPlayer.id = generateId();
    this.clientPlayer.positionX = getRandomNumber(1, 40);
    this.clientPlayer.positionY = getRandomNumber(1, 40);
    this.clientPlayer.playerName = 'A';
    this.clientPlayer.playerColor = getRandomPlayerColor();
    this.clientPlayer.sizeX = Constants.PLAYER_SIZE_X;
    this.clientPlayer.sizeY = Constants.PLAYER_SIZE_Y;
    this.clientPlayer.hitPoints = Constants.PLAYER_STARTING_HIT_POINTS;
    this.clientPlayer.direction = 0;
  }

  ngOnInit() {
    this.signalRService.startConnection();

    this.signalRService.addBroadcastConnectionAmountDataListener(this.sendPlayerData);
    this.signalRService.addBroadcastPlayerDataMessageListener();
    this.signalRService.addBroadcastFireballDataMessageListener(this.clientPlayer);
    this.signalRService.addBroadcastFireballHitPlayerMessageListener(this.clientPlayer);

    this.startHttpRequest();

    //Refresher makes sure that clients update dom all the time
    setInterval(() => {this.refresher=this.refresher*-1}, Constants.REFRESHER_REFRESH_RATE_MS);
  }

  private startHttpRequest = () => {
    const isProductionEnvironment = environment.production;
    const serverBaseUrl = isProductionEnvironment ? 'https://tuomas-angular-combat-server.azurewebsites.net/api' : 'https://localhost:44342/api'; //'https://localhost:5001/api';
    this.http.get(serverBaseUrl + '/hub')
      .subscribe(res => {
        console.log(res);
      })
  }

  public sendPlayerData = () => {
    this.signalRService.broadcastPlayerDataMessage(this.clientPlayer);
  }

  public cast = () => {
    if (this.clientPlayer.hitPoints > 0) {
      this.signalRService.broadcastFireballDataMessage(new Fireball(
        generateId(),
        this.clientPlayer.id,
        this.clientPlayer.positionX+Math.floor(this.clientPlayer.sizeX/2)-Math.floor(Constants.FIREBALL_SIZE_X/2),
        this.clientPlayer.positionY+Math.floor(this.clientPlayer.sizeY/2)-Math.floor(Constants.FIREBALL_SIZE_Y/2),
        this.clientPlayer.direction,
        Constants.FIREBALL_MOVEMENT_INTERVAL,
        Constants.FIREBALL_SIZE_X,
        Constants.FIREBALL_SIZE_Y
      ));
    }
  }

  //Keyboard actions
  @HostListener("window:keydown", ['$event'])
  onKeyDown(event:KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        this.go();
        break;
      case "ArrowDown":
        this.goBackwards();
        break;
      case "ArrowLeft":
        this.turnLeft();
        break;
      case "ArrowRight":
        this.turnRight();
        break;
      case "Control":
        this.cast();
        break;
      default:
        break;
      }
  }

  turnRight = () => {
    if (this.clientPlayer.hitPoints > 0) {
      this.clientPlayer.direction = ((this.clientPlayer.direction + Constants.PLAYER_ROTATE_ANGLE_AMOUNT) % 360);
    }
  }
  turnLeft = () => {
    if (this.clientPlayer.hitPoints > 0) {
      this.clientPlayer.direction = ((this.clientPlayer.direction - Constants.PLAYER_ROTATE_ANGLE_AMOUNT) % 360);
      if (this.clientPlayer.direction < 0) {
        this.clientPlayer.direction = 360 + this.clientPlayer.direction;
      };
    }
  }
  go = () => {
    if (this.clientPlayer.hitPoints > 0) {
      this.clientPlayer.move(this.clientPlayer, this.clientPlayer.direction, this.sendPlayerData);
    }
  }
  goBackwards = () => {
    if (this.clientPlayer.hitPoints > 0) {
      this.clientPlayer.move(this.clientPlayer, this.clientPlayer.direction-180, this.sendPlayerData);
      this.clientPlayer.direction += 180;
    }
  }
}
