import { FireballActions } from './fireballActions';
import { Fireball } from '../models/Fireball.model';
import { Constants } from '../constants/constants';
import { SignalRService } from '../services/signal-r.service';
import { Player } from '../models/Player.model';
import { Obstacle } from '../models/Obstacle.model';

describe('FireballActions', () => {

  //Allow the functions some time to work before finishing.
  beforeEach(function(done) {
    setTimeout(function() {
        done();
    }, Constants.FIREBALL_MOVEMENT_INTERVAL * 50);
  });

  it('Fireball should move', (done: Function) => {
    const fireball: Fireball = new Fireball("1", "2", 1, 1, 0, Constants.FIREBALL_MOVEMENT_INTERVAL, Constants.FIREBALL_SIZE_X, Constants.FIREBALL_SIZE_Y); //Direction is 0 which is to the right
    const signalRService: SignalRService = new SignalRService();
    const player: Player = new Player();
    FireballActions.startMovement(fireball, signalRService, player);

    expect(fireball.positionX).toBe(1);

    setTimeout(() => {
      expect(fireball.positionX).toBeGreaterThan(1);
    }, Constants.FIREBALL_MOVEMENT_INTERVAL * 3);

    done();
  });

  it('Fireball should collide with an obstacle', (done: Function) => {
    const fireball: Fireball = new Fireball("10", "2", 1, 2, 0, Constants.FIREBALL_MOVEMENT_INTERVAL, Constants.FIREBALL_SIZE_X, Constants.FIREBALL_SIZE_Y); //Direction is 0 which is to the right
    const signalRService: SignalRService = new SignalRService();
    const player: Player = new Player();

    signalRService.obstacles = [new Obstacle("a", 6, 0, 0, 4, 4)] // One obstacle at (6, 0), has size 4x4

    FireballActions.startMovement(fireball, signalRService, player);

    //At first, the fireball shouldn't be destroyed
    expect(fireball.isDestroyed).toBe(false);

    setTimeout(() => {
      expect(fireball.isDestroyed).toBe(true);
      //The fireball should have hit an obstacle after moving
    }, Constants.FIREBALL_MOVEMENT_INTERVAL * 5);

    done();
  });
});
