import { ItemBase } from './ItemBase.model';
import { MovementState } from '../enums/enums';
import { Constants } from '../constants/constants';

export class Player extends ItemBase {
  playerName: string;
  playerColor: string;
  hitPoints: number;
  takeDamage: Function = takeDamage;
  movementState: MovementState = MovementState.Stopped;
  movementIntervalMs: number = Constants.PLAYER_MOVEMENT_INTERVAL;
};

const takeDamage = (player: Player, amount: number, sendPlayerDataFunction: Function) => {
  player.hitPoints -= amount;
  sendPlayerDataFunction(player);
}
