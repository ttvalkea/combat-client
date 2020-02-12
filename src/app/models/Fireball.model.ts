import { Direction } from '../enums/enums';
import { ItemBase } from './ItemBase.model';

export class Fireball extends ItemBase {
  casterId: string;
  moveIntervalMs: number;
  moveFunc: Function;
  isDestroyed: Boolean = false;

  constructor(id: string, casterId: string, positionX: number, positionY: number, direction: Direction, moveIntervalMs: number, sizeX: number, sizeY: number) {

    super();

    this.id = id;
    this.casterId = casterId;
    this.positionX = positionX;
    this.positionY = positionY;
    this.direction = direction;
    this.moveIntervalMs = moveIntervalMs;
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.moveFunc = this.move;
  }

  move = (mover, direction: Direction, postMovementAction: Function) => {

    mover.direction = direction;

    switch (direction) {
      case Direction.Up:
        mover.positionY -= 1;
        break;
      case Direction.Down:
        mover.positionY += 1;
        break;
      case Direction.Left:
        mover.positionX -= 1;
        break;
      case Direction.Right:
        mover.positionX += 1;
        break;
    }

    if (mover.positionX > 47) {
      mover.isDestroyed = true;
    } else if (mover.positionX < 0) {
      mover.isDestroyed = true;
    }
    if (mover.positionY > 47) {
      mover.isDestroyed = true;
    } else if (mover.positionY < 0) {
      mover.isDestroyed = true;
    }

    postMovementAction();
  }
};
