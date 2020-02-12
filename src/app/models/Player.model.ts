import { ItemBase } from './ItemBase.model';

export class Player extends ItemBase {
  playerName: string;
  playerColor: string;
  hitPoints: number;
  takeDamage: Function = takeDamage;
};

const takeDamage = (player: Player, amount: number, sendPlayerDataFunction: Function) => {
  player.hitPoints -= amount;
  sendPlayerDataFunction(player);
}
