import { Direction } from '../enums/enums';

export class ItemBase {
  id: string;
  positionX: number;
  positionY: number;
  direction: Direction;
  sizeX: number;
  sizeY: number;
};
