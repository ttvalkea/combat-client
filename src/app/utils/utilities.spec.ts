import { Constants } from '../constants/constants';
import { Player } from '../models/Player.model';
import { Utilities } from './utilities';
import { OnCollisionAction } from '../enums/enums';
import { SignalRService } from '../services/signal-r.service';

describe('Utilities', () => {

  it('Player should be able to move.', () => {
    const player: Player = new Player();
    const signalRService: SignalRService = new SignalRService();

    //Player starts in position (0, 0) and moves once towards bottom right
    Utilities.angledMoveFunction(player, signalRService, 45, () => {}, OnCollisionAction.Stop);
    expect(player.positionX).toBeGreaterThan(0);
    expect(player.positionY).toBeGreaterThan(0);
  });
});
