import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from '../../environments/environment';
import { Player } from '../models/Player.model';
import { Fireball } from '../models/Fireball.model';
import { Direction } from '../enums/enums';
import { ItemBase } from '../models/ItemBase.model';
import { FireballHitPlayerData } from '../models/FireballHitPlayerData.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public connectionAmount: number = 0;
  private hubConnection: signalR.HubConnection

  public players: Player[] = [];
  public fireballs: Fireball[] = [];

  public startConnection = () => {
    const isProductionEnvironment = environment.production;
    const serverBaseUrl = isProductionEnvironment ? 'https://tuomas-angular-combat-server.azurewebsites.net' : 'https://localhost:44342';//'https://localhost:5001';
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(serverBaseUrl + '/chat')
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addBroadcastConnectionAmountDataListener = (playerInfoFunction: Function) => {
    this.hubConnection.on('broadcastconnectionamountdata', (data) => {
      this.connectionAmount = data;

      //This player receives other player's data when entering the game
      this.players = [];
      playerInfoFunction();
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

  //TODO: Only the fireball's caster should invoke this+
  public broadcastFireballHitPlayerMessage = (fireball: Fireball, player: Player) => {
    this.hubConnection.invoke('broadcastFireballHitPlayerMessage', fireball, player)
    .catch(err => console.error(err));
  }

  public addBroadcastFireballHitPlayerMessageListener = (listeningPlayer: Player) => {
    this.hubConnection.on('broadcastFireballHitPlayerMessage', (data: FireballHitPlayerData) => {
      this.fireballs = this.fireballs.filter(fireball => fireball.id !== data.fireballId);

      if (listeningPlayer.id === data.playerId) {
        listeningPlayer.takeDamage(listeningPlayer, 1, this.broadcastPlayerDataMessage);
      }
    })
  }

  // Updates a player's data if it's already in the players array or adds a new player
  private updatePlayerData = (playerData: Player) => {
    this.players = this.players.filter(player => player.id !== playerData.id);
    this.players.push(playerData);
    this.getPlayersWithPlayersCollisions();
  }

   //TODO: Make a more general collision function instead of duplicating this one
  private getPlayersWithPlayersCollisions = () => {
    //Check each player pair's collision. Players A, B, C, D: For A, check with B, C and D. For B, check with C, D. For C, check with D. For D, check with no-one.
    for (let i = 0; i < this.players.length - 1; i++) {
      for (let j = i+1; j < this.players.length; j++) {
        const collision = this.isPlayerCollidingWithPlayer(this.players[i], this.players[j]);
        // console.log(collision, this.players[i].positionX, this.players[j].positionX, this.players[i].positionY, this.players[j].positionY);
      }
    }
  }

  private isPlayerCollidingWithPlayer = (player1: Player, player2: Player) => {
    return this.areItemsColliding(player1, player2);
  }

  private areItemsColliding = (item1: ItemBase, item2: ItemBase) => {
    return  Math.abs((item1.positionX + item1.sizeX/2) - (item2.positionX + item2.sizeX/2)) < (item1.sizeX+item2.sizeX)/2 &&
            Math.abs((item1.positionY + item1.sizeY/2) - (item2.positionY + item2.sizeY/2)) < (item1.sizeY+item2.sizeY)/2;
  }

  public broadcastFireballDataMessage = (message: Fireball) => {
    this.hubConnection.invoke('broadcastFireballDataMessage', message)
    .catch(err => console.error(err));
  }

  //TODO: Make a more general collision function instead of duplicating this one
  private getFireballWithPlayersCollisions = (fireball: Fireball) => {
    const playersOtherThanCaster = this.players.filter(player => player.id !== fireball.casterId);
    for (let i = 0; i < playersOtherThanCaster.length; i++) {
      const collision = this.isFireballCollidingWithPlayer(fireball, playersOtherThanCaster[i]);
      if (collision) {
        this.broadcastFireballHitPlayerMessage(fireball, playersOtherThanCaster[i]);
        fireball.isDestroyed = true;
        return;
      }
      // console.log(collision, fireball.positionX, playersOtherThanCaster[i].positionX, fireball.positionY, playersOtherThanCaster[i].positionY);
    }
  }

  private isFireballCollidingWithPlayer = (fireball: Fireball, player: Player) => {
    return this.areItemsColliding(fireball, player);
  }

  public addBroadcastFireballDataMessageListener = (listeningPlayer: Player) => {
    this.hubConnection.on('broadcastFireballDataMessage', (data: Fireball) => {
      data.moveFunc = new Fireball('', '', 0, 0, Direction.Down, 0, 0, 0).moveFunc; //TODO: Movement function should be in utils or somewhere general
      this.fireballs.push(data);
      //Fireball's movement
      const interval = setInterval(() => {
        if (!data.isDestroyed) {
          data.moveFunc(data, data.direction, () => {});

          //Only the player, who cast the fireball, makes collision checks and broadcasts them to everyone
          if (data.casterId === listeningPlayer.id) {
            this.getFireballWithPlayersCollisions(data);
            console.log()
          }

          if (data.isDestroyed) {
            this.fireballs = this.fireballs.filter(x => x.id !== data.id);
          }
        } else {
          clearInterval(interval);
        }
      }, data.moveIntervalMs);
    })
  }
}
