import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { getRandomNumber, getRandomPlayerColor, generateId } from './utils/utils';
import { Player } from './models/Player.model';
import { Fireball } from './models/Fireball.model';
import { Direction } from './enums/enums';

//TODO: Refactor different entities into their own files (Player etc)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public player: Player = new Player();

  constructor(public signalRService: SignalRService, private http: HttpClient) {
    this.player.id = generateId();
    this.player.positionX = getRandomNumber(1, 40);
    this.player.positionY = getRandomNumber(1, 40);
    this.player.playerName = 'A';
    this.player.playerColor = getRandomPlayerColor();
    this.player.sizeX = 5; //TODO: Put all of these constants to a constants file
    this.player.sizeY = 5;
    this.player.hitPoints = 5;
  }

  ngOnInit() {
    this.signalRService.startConnection();

    this.signalRService.addBroadcastConnectionAmountDataListener(this.sendPlayerData);
    this.signalRService.addBroadcastPlayerDataMessageListener();
    this.signalRService.addBroadcastFireballDataMessageListener(this.player);
    this.signalRService.addBroadcastFireballHitPlayerMessageListener(this.player);

    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    const isProductionEnvironment = environment.production;
    const serverBaseUrl = isProductionEnvironment ? 'https://TODO-server.azurewebsites.net/api' : 'https://localhost:44342/api'; //'https://localhost:5001/api';
    this.http.get(serverBaseUrl + '/chat')
      .subscribe(res => {
        console.log(res);
      })
  }

  public sendPlayerData = () => {
    this.signalRService.broadcastPlayerDataMessage(this.player);
  }

  //TODO: Make this ItemBase's function (use it with fireball as well) and use item.size there
  public move = (mover, direction: Direction, postMovementAction: Function) => {

    if (this.player.hitPoints > 0) {
      mover.direction = direction;

      switch (direction) {
        case Direction.Up:
          mover.positionY -= 1;
          break;
        case Direction.Down:
          mover.positionY += 1;
          break;
        case Direction.Left:
          mover.positionX -= 1;
          break;
        case Direction.Right:
          mover.positionX += 1;
          break;
      }

      if (mover.positionX > 45) {
        mover.positionX = 45;
      } else if (mover.positionX < 0) {
        mover.positionX = 0;
      }
      if (mover.positionY > 45) {
        mover.positionY = 45;
      } else if (mover.positionY < 0) {
        mover.positionY = 0;
      }

      this.sendPlayerData();
    }
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
      this.signalRService.broadcastFireballDataMessage(new Fireball(generateId(), this.player.id, this.player.positionX+2, this.player.positionY+2, this.player.direction, 100, 2, 2));
    }
  }
}
