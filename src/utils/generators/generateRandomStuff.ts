import { firstName, secondName } from '../../configAndConstants.js';
import { randomInt } from 'node:crypto';

const generateName = (): string => {
  const rand_pos_2: number = randomInt(0, secondName.length);
  const rand_pos_1: number = randomInt(0, firstName.length);
  const name: string = firstName[rand_pos_1] + ' ' + secondName[rand_pos_2];
  return name;
};

const generateNumber = (minRange = 0, maxRange = 100): number => {
  return randomInt(minRange, maxRange);
};

const generateOtp = (): number => {
  return randomInt(100000, 999999);
};

const test = (): void => {
  console.log(generateName(), generateNumber(), generateOtp());
};
// test();

export { generateName, generateNumber, generateOtp };
