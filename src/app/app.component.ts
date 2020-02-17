import { Component, OnInit, HostListener } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { getRandomNumber, getRandomPlayerColor, generateId } from './utils/utils';
import { Player } from './models/Player.model';
import { Fireball } from './models/Fireball.model';
import { Direction } from './enums/enums';
import { Constants } from './constants/constants';


//TODO: Refactor different entities into their own files (Player etc)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public player: Player = new Player();
  public refresher: number = 1; //This will just flick between 1 and -1 indefinitely, ensuring DOM refreshing.
  public constants = Constants; //This is declared for Angular template to have access to constants

  constructor(public signalRService: SignalRService, private http: HttpClient) {
    this.player.id = generateId();
    this.player.positionX = getRandomNumber(1, 40);
    this.player.positionY = getRandomNumber(1, 40);
    this.player.playerName = 'A';
    this.player.playerColor = getRandomPlayerColor();
    this.player.sizeX = Constants.PLAYER_SIZE_X;
    this.player.sizeY = Constants.PLAYER_SIZE_Y;
    this.player.hitPoints = Constants.PLAYER_STARTING_HIT_POINTS;
  }

  ngOnInit() {
    this.signalRService.startConnection();

    this.signalRService.addBroadcastConnectionAmountDataListener(this.sendPlayerData);
    this.signalRService.addBroadcastPlayerDataMessageListener();
    this.signalRService.addBroadcastFireballDataMessageListener(this.player);
    this.signalRService.addBroadcastFireballHitPlayerMessageListener(this.player);

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
    this.signalRService.broadcastPlayerDataMessage(this.player);
  }

  public getDirectionInTemplate = (dir: string) => {
    switch (dir) {
      case "Up":
        return Direction.Up;
      case "Down":
        return Direction.Down;
      case "Left":
        return Direction.Left;
      case "Right":
        return Direction.Right;
    }
  }

  public cast = () => {
    if (this.player.hitPoints > 0) {
      this.signalRService.broadcastFireballDataMessage(new Fireball(
        generateId(),
        this.player.id,
        this.player.positionX+Math.floor(this.player.sizeX/2)-Math.floor(Constants.FIREBALL_SIZE_X/2),
        this.player.positionY+Math.floor(this.player.sizeY/2)-Math.floor(Constants.FIREBALL_SIZE_Y/2),
        this.player.direction,
        Constants.FIREBALL_MOVEMENT_INTERVAL,
        Constants.FIREBALL_SIZE_X,
        Constants.FIREBALL_SIZE_Y
      ));
    }
  }

  //Apparently you can't use () => {} in Angular templates, so we use this great function.
  public emptyFunction = () => {}

  //Keyboard actions
  @HostListener("window:keydown", ['$event'])
  onKeyDown(event:KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        this.player.move(this.player, Direction.Up, this.sendPlayerData);
        break;
      case "ArrowDown":
        this.player.move(this.player, Direction.Down, this.sendPlayerData);
        break;
      case "ArrowLeft":
        this.player.move(this.player, Direction.Left, this.sendPlayerData);
        break;
      case "ArrowRight":
        this.player.move(this.player, Direction.Right, this.sendPlayerData);
        break;
      case "Control":
          this.cast();
          break;
      default:
        break;
    }
  }
}
