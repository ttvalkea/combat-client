import { Constants } from '../constants/constants';
import { Player } from '../models/Player.model';
import { PlayerActions } from './playerActions';

describe('PlayerActions', () => {

  it('Player should be able to turn left and right.', () => {
    const player: Player = new Player();
    player.direction = 0;
    PlayerActions.turnRight(player);
    expect(player.direction).toBe(Constants.PLAYER_ROTATE_ANGLE_AMOUNT);
    PlayerActions.turnLeft(player);
    expect(player.direction).toBe(0);
    PlayerActions.turnLeft(player);
    expect(player.direction).toBe(360-Constants.PLAYER_ROTATE_ANGLE_AMOUNT);
  });
});
