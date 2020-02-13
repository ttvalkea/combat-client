import { Direction, OnCollisionAction } from '../enums/enums';
import { Constants } from '../constants/constants';

export class ItemBase {

  moveFunction = (mover, direction: Direction, postMovementAction: Function, onCollisionAction: OnCollisionAction = OnCollisionAction.Stop) => {

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

    if ((mover.positionX + mover.sizeX) > Constants.PLAY_AREA_SIZE_X) {
      if (onCollisionAction === OnCollisionAction.Destroy) {
        mover.isDestroyed = true;
      } else if (onCollisionAction === OnCollisionAction.Stop) {
        mover.positionX = Constants.PLAY_AREA_SIZE_X - mover.sizeX;
      }
    } else if (mover.positionX < 0) {
      if (onCollisionAction === OnCollisionAction.Destroy) {
        mover.isDestroyed = true;
      } else if (onCollisionAction === OnCollisionAction.Stop) {
        mover.positionX = 0;
      }
    }
    if ((mover.positionY + mover.sizeY) > Constants.PLAY_AREA_SIZE_Y) {
      if (onCollisionAction === OnCollisionAction.Destroy) {
        mover.isDestroyed = true;
      } else if (onCollisionAction === OnCollisionAction.Stop) {
        mover.positionY = Constants.PLAY_AREA_SIZE_Y - mover.sizeY;
      }
    } else if (mover.positionY < 0) {
      if (onCollisionAction === OnCollisionAction.Destroy) {
        mover.isDestroyed = true;
      } else if (onCollisionAction === OnCollisionAction.Stop) {
        mover.positionY = 0;
      }
    }

    postMovementAction();
  }

  id: string;
  positionX: number;
  positionY: number;
  direction: Direction;
  sizeX: number;
  sizeY: number;
  move: Function = this.moveFunction;
};

