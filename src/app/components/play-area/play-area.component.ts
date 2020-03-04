import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Player } from 'src/app/models/Player.model';
import { Constants } from 'src/app/constants/constants';
import { SignalRService } from 'src/app/services/signal-r.service';
import { PlayerActions } from 'src/app/classes/playerActions';

@Component({
  selector: 'app-play-area',
  templateUrl: './play-area.component.html',
  styleUrls: ['./play-area.component.css']
})
export class PlayAreaComponent implements OnInit {

  @Input() clientPlayer: Player;
  public constants = Constants;

  constructor(public signalRService: SignalRService) { }

  ngOnInit() {
    PlayerActions.startPlayerIntervals(this.clientPlayer, this.signalRService);
  }

  //Keyboard actions
  @HostListener("window:keydown", ['$event'])
  onKeyDown(event:KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        PlayerActions.forwardInput(this.clientPlayer);
        break;
      case "ArrowDown":
        PlayerActions.backwardInput(this.clientPlayer);
        break;
      case "ArrowLeft":
        PlayerActions.turnLeft(this.clientPlayer);
        break;
      case "ArrowRight":
        PlayerActions.turnRight(this.clientPlayer);
        break;
      case "Control":
        PlayerActions.cast(this.clientPlayer, this.signalRService);
        break;
      default:
        break;
      }
  }

}
