import { ItemBase } from './ItemBase.model';
import { MovementState } from '../enums/enums';
import { Constants } from '../constants/constants';
import { Utilities } from '../utils/utilities';

export class Player extends ItemBase {
  playerColor: string = Utilities.getRandomPlayerColor();
  hitPoints: number = Constants.PLAYER_STARTING_HIT_POINTS;
  movementState: MovementState = MovementState.Stopped;
  movementIntervalMs: number = Constants.PLAYER_MOVEMENT_INTERVAL;
  score: number = 0
  manaAmount: number = Constants.PLAYER_STARTING_MANA;
  hasPlayerStartingPositionBeenSet: boolean = false;

  constructor() {
    super();
    this.id = Utilities.generateId();
    this.sizeX = Constants.PLAYER_SIZE_X;
    this.sizeY = Constants.PLAYER_SIZE_Y;
    this.direction = 0;
    this.positionX = 0;
    this.positionY = 0;
  }
};

