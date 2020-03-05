import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from '../../environments/environment';
import { Player } from '../models/Player.model';
import { Fireball } from '../models/Fireball.model';
import { Obstacle } from '../models/Obstacle.model';
import { FireballHitPlayerData } from '../models/FireballHitPlayerData.model';
import { NewTagItem } from '../models/NewTagItem.model';
import { PlayerActions } from '../classes/playerActions';
import { FireballActions } from '../classes/fireballActions';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public connectionAmount: number = 0;
  private hubConnection: signalR.HubConnection

  public players: Player[] = [];
  public fireballs: Fireball[] = [];
  public obstacles: Obstacle[] = [];
  public tagPlayerId: string; //Id of the player who is currently gaining victory points.
  public tagItem: NewTagItem;
  public winner: Player;

  public startConnection = () => {
    const isProductionEnvironment = environment.production;
    const serverBaseUrl = isProductionEnvironment ? 'https://tuomas-angular-combat-server.azurewebsites.net' : 'https://localhost:44342';//'https://localhost:5001';
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(serverBaseUrl + '/hub')
                            .build();

    this.hubConnection
      .start()
      .then(this.actionsAfterSignalRConnectionStarted)
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  private actionsAfterSignalRConnectionStarted = () => {
    console.log('SignalR connection formed.');

    this.broadcastGetObstacles(false);
    this.broadcastNewTagItemData();
    this.broadcastGetTagPlayerId();
  }

  public addBroadcastConnectionAmountDataListener = (player: Player) => {
    this.hubConnection.on('broadcastconnectionamountdata', (data) => {
      this.connectionAmount = data;

      //This player receives other player's data when entering the game
      this.players = [];
      PlayerActions.broadcastPlayerData(player, this);
    })
  }

  public broadcastPlayerDataMessage = (message: Player) => {
    this.hubConnection.invoke('broadcastPlayerDataMessage', message)
    .catch(err => console.error(err));
  }

  public addBroadcastPlayerDataMessageListener = () => {
    this.hubConnection.on('broadcastPlayerDataMessage', (data: Player) => {
      this.updatePlayerData(data);
    })
  }

  // Updates a player's data if it's already in the players array or adds a new player
  private updatePlayerData = (playerData: Player) => {
    this.players = this.players.filter(player => player.id !== playerData.id);
    this.players.push(playerData);
  }

  public broadcastFireballHitPlayerMessage = (fireball: Fireball, player: Player) => {
    this.hubConnection.invoke('broadcastFireballHitPlayerMessage', fireball, player)
    .catch(err => console.error(err));
  }

  public addBroadcastFireballHitPlayerMessageListener = (listeningPlayer: Player) => {
    this.hubConnection.on('broadcastFireballHitPlayerMessage', (data: FireballHitPlayerData) => {
      this.fireballs = this.fireballs.filter(fireball => fireball.id !== data.fireballId);

      if (listeningPlayer.id === data.playerId) {
        PlayerActions.takeDamage(listeningPlayer, 1, this.broadcastPlayerDataMessage);
      }
    })
  }

  public broadcastFireballDataMessage = (message: Fireball) => {
    this.hubConnection.invoke('broadcastFireballDataMessage', message)
    .catch(err => console.error(err));
  }

  public addBroadcastFireballDataMessageListener = (listeningPlayer: Player) => {
    this.hubConnection.on('broadcastFireballDataMessage', (fireball: Fireball) => {
      FireballActions.startMovement(fireball, this, listeningPlayer);
      this.fireballs.push(fireball);
    })
  }

  public broadcastGetObstacles = (generateNewObstacles: boolean) => {
    this.hubConnection.invoke('broadcastGetObstacles', generateNewObstacles)
    .catch(err => console.error(err));
  }

  public addBroadcastGetObstaclesListener = (player: Player) => {
    this.hubConnection.on('broadcastGetObstacles', (data: Obstacle[]) => {
      this.obstacles = data;
      PlayerActions.setStartingPosition(player, this);
    })
  }

  public addNewTagListener = () => {
    this.hubConnection.on('newTag', (newTagItem: NewTagItem) => {
      this.tagItem = newTagItem;
    })
  }

  public broadcastPlayerHitNewTagItem = (playerId: string) => {
    this.hubConnection.invoke('broadcastPlayerHitNewTagItem', playerId)
    .catch(err => console.error(err));
  }

  public addBroadcastPlayerBecomesTagListener = () => {
    this.hubConnection.on('broadcastPlayerBecomesTag', (playerId: string) => {
      this.tagPlayerId = playerId;
    })
  }

  public broadcastNewTagItemData = () => {
    this.hubConnection.invoke('broadcastNewTagItemData')
    .catch(err => console.error(err));
  }

  public broadcastPlayerWins = (message: Player) => {
    this.hubConnection.invoke('broadcastPlayerWins', message)
    .catch(err => console.error(err));
  }

  public addBroadcastPlayerWinsListener = () => {
    this.hubConnection.on('broadcastPlayerWins', (player: Player) => {
      this.winner = player;
    })
  }

  public broadcastGetTagPlayerId = () => {
    this.hubConnection.invoke('broadcastGetTagPlayerId')
    .catch(err => console.error(err));
  }

  public addBroadcastGetTagPlayerIdListener = () => {
    this.hubConnection.on('broadcastGetTagPlayerId', (playerId: string) => {
      this.tagPlayerId = playerId;
    })
  }
}
