import { Direction } from '../enums/enums';

export const getRandomNumber = (min, max) => Math.floor((Math.random() * max) + min);

export const getRandomPlayerColor = () => {
  const colorNumber = getRandomNumber(1, 12);
  switch (colorNumber) {
    case 1:
      return "red";
    case 2:
      return "blue";
    case 3:
      return "yellow";
    case 4:
      return "cyan";
    case 5:
      return "darkgreen";
    case 6:
      return "magenta";
    case 7:
      return "violet";
    case 8:
      return "white";
    case 9:
      return "orange";
    case 10:
      return "lightblue";
    case 11:
      return "olive";
    case 12:
      return "azure";
  }
}

export const generateId = (prefix) => {
  return (prefix ? prefix : '') + Date.now() + getRandomNumber(0, 1000).toString();
}

