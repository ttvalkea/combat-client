import { Fireball } from '../models/Fireball.model';
import { Utilities } from '../utils/utilities';
import { SignalRService } from '../services/signal-r.service';
import { OnCollisionAction } from '../enums/enums';
import { Player } from '../models/Player.model';

export class FireballActions {

  public static startMovement = (fireball: Fireball, signalRService: SignalRService, caster: Player) => {
    //Server can't return the move function, so it's reassigned here
    fireball.move = Utilities.angledMoveFunction;

    //Fireball's movement
    const interval = setInterval(() => {
      if (!fireball.isDestroyed) {
        fireball.move(fireball, signalRService, fireball.direction, () => {}, OnCollisionAction.Destroy, signalRService.obstacles);

        //Only the player, who cast the fireball, makes collision checks and broadcasts them to everyone
        if (fireball.casterId === caster.id) {
          FireballActions.getFireballWithPlayersCollisions(fireball, signalRService);
        }

        if (fireball.isDestroyed) {
          signalRService.fireballs = signalRService.fireballs.filter(x => x.id !== fireball.id);
        }
      } else {
        clearInterval(interval);
      }
    }, fireball.moveIntervalMs);
  }

  private static getFireballWithPlayersCollisions = (fireball: Fireball, signalRService: SignalRService) => {
    const playersOtherThanCaster = signalRService.players.filter(player => player.id !== fireball.casterId);
    Utilities.doItemCollision(fireball, playersOtherThanCaster, (collidedPlayer) => {
      signalRService.broadcastFireballHitPlayerMessage(fireball, collidedPlayer);
      fireball.isDestroyed = true;
    });
  }
}
