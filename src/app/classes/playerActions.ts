import { Player } from '../models/Player.model';
import { Constants } from '../constants/constants';
import { SignalRService } from '../services/signal-r.service';
import { Utilities } from '../utils/utilities';
import { OnCollisionAction, MovementState } from '../enums/enums';
import { Fireball } from '../models/Fireball.model';

export class PlayerActions {
  public static takeDamage = (player: Player, amount: number, broadcastPlayerDataFunction: Function) => {
    if (player.hitPoints > 0) {
      player.hitPoints -= amount;

      if (player.hitPoints <= 0) {
        //Players are knocked out only for moment
        setTimeout(() => {
          player.hitPoints = Constants.PLAYER_STARTING_HIT_POINTS;
          broadcastPlayerDataFunction(player);
        }, Constants.PLAYER_KNOCKOUT_DURATION_MS);
      }
      broadcastPlayerDataFunction(player);
    }
  }

  public static setStartingPosition = (player: Player, signalRService: SignalRService) => {
    if (!player.hasPlayerStartingPositionBeenSet) {
      let isPositionOk = false;

      while (!isPositionOk) {
        player.positionX = Utilities.getRandomNumber(0, Constants.PLAY_AREA_SIZE_X-player.sizeX);
        player.positionY = Utilities.getRandomNumber(0, Constants.PLAY_AREA_SIZE_Y-player.sizeY);
        isPositionOk = true;
        Utilities.doItemCollision(player, signalRService.obstacles, () => {
          isPositionOk = false;
        });
      }
      PlayerActions.broadcastPlayerData(player, signalRService);
      player.hasPlayerStartingPositionBeenSet = true;
    }
  }

  public static cast = (player: Player, signalRService: SignalRService) => {
    if (player.hitPoints > 0 && player.manaAmount >= Constants.FIREBALL_MANA_COST && !signalRService.winner) {
      player.manaAmount -= Constants.FIREBALL_MANA_COST;
      signalRService.broadcastFireballDataMessage(new Fireball(
        Utilities.generateId(),
        player.id,
        player.positionX+Math.floor(player.sizeX/2)-Math.floor(Constants.FIREBALL_SIZE_X/2),
        player.positionY+Math.floor(player.sizeY/2)-Math.floor(Constants.FIREBALL_SIZE_Y/2),
        player.direction,
        Constants.FIREBALL_MOVEMENT_INTERVAL,
        Constants.FIREBALL_SIZE_X,
        Constants.FIREBALL_SIZE_Y
      ));
    }
  }

  public static forwardInput = (player: Player) => {
    player.movementState = player.movementState === MovementState.Backward ? MovementState.Stopped : MovementState.Forward;
  }

  public static backwardInput = (player: Player) => {
    player.movementState = player.movementState === MovementState.Forward ? MovementState.Stopped : MovementState.Backward;
  }

  public static turnRight = (player: Player) => {
    if (player.hitPoints > 0) {
      player.direction = ((player.direction + Constants.PLAYER_ROTATE_ANGLE_AMOUNT) % 360);
    }
  }
  public static turnLeft = (player: Player) => {
    if (player.hitPoints > 0) {
      player.direction = ((player.direction - Constants.PLAYER_ROTATE_ANGLE_AMOUNT) % 360);
      if (player.direction < 0) {
        player.direction = 360 + player.direction;
      };
    }
  }
  public static go = (player: Player, signalRService: SignalRService) => {
    if (player.hitPoints > 0 && !signalRService.winner) {
      player.move(player, signalRService, player.direction, PlayerActions.postMovementAction, OnCollisionAction.Stop, signalRService.obstacles);
    }
  }
  public static goBackwards = (player: Player, signalRService: SignalRService) => {
    if (player.hitPoints > 0 && !signalRService.winner) {
      player.move(player, signalRService, player.direction-180, PlayerActions.postMovementAction, OnCollisionAction.Stop, signalRService.obstacles);
      player.direction += 180;
    }
  }

  public static broadcastPlayerData = (player: Player, signalRService: SignalRService) => {
    signalRService.broadcastPlayerDataMessage(player);
  }

  private static postMovementAction = (player: Player, signalRService: SignalRService) => {
    PlayerActions.checkForCollisionWithNewTagItem(player, signalRService);
    PlayerActions.broadcastPlayerData(player, signalRService);
  }

  private static checkForCollisionWithNewTagItem = (player: Player, signalRService: SignalRService) => {
    if (signalRService.tagItem && signalRService.tagItem.isInPlay) {
      Utilities.doItemCollision(player, [signalRService.tagItem], () => { signalRService.broadcastPlayerHitNewTagItem(player.id); });
    }
  }

  public static startPlayerIntervals(player: Player, signalRService: SignalRService) {
    //Player's movement interval
    setInterval(() => {
      switch (player.movementState) {
        case MovementState.Forward:
          PlayerActions.go(player, signalRService);
          break;
        case MovementState.Backward:
          PlayerActions.goBackwards(player, signalRService);
          break;
      }
    }, player.movementIntervalMs);

    //Player's mana regeneration
    setInterval(() => { if (player.manaAmount < Constants.PLAYER_STARTING_MANA) player.manaAmount++; }, Constants.PLAYER_MANA_REGENERATION_INTERVAL);

    //Player's scoring interval
    setInterval(() => {
      if (signalRService.tagPlayerId && player.id === signalRService.tagPlayerId && !signalRService.winner) {
        player.score++;
        PlayerActions.broadcastPlayerData(player, signalRService);
      }
      if (player.score >= Constants.SCORE_NEEDED_TO_WIN && !signalRService.winner) {
        signalRService.broadcastPlayerWins(player);
      }
    }, Constants.PLAYER_SCORE_GETTING_INTERVAL);
  }
}
