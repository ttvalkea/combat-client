import { OnCollisionAction } from '../enums/enums';
import { Constants } from '../constants/constants';
import { getXAndYIncrementsByAngle } from '../utils/utils';

export class ItemBase {

  angledMoveFunction = (mover, direction: number, postMovementAction: Function, onCollisionAction: OnCollisionAction = OnCollisionAction.Stop) => {

    mover.direction = direction;
    const xAndYIncrement = getXAndYIncrementsByAngle(direction);

    mover.positionX += xAndYIncrement.x;
    mover.positionY += xAndYIncrement.y;

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
  direction: number;
  sizeX: number;
  sizeY: number;
  move: Function = this.angledMoveFunction;
};

