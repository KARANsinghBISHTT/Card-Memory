import { shuffleArray } from '../shuffleArray';

describe('shuffleArray', () => {
  test('shuffles the array and returns a new array', () => {
    const originalArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffleArray(originalArray);
    expect(shuffledArray).not.toEqual(originalArray);
    expect(shuffledArray).toHaveLength(originalArray.length);
    expect(shuffledArray.sort()).toEqual(originalArray.sort());
  });

  test('works correctly with an empty array', () => {
    const originalArray = [];
    const shuffledArray = shuffleArray(originalArray);
    expect(shuffledArray).toEqual([]);
  });

  test('works correctly with an array of one element', () => {
    const originalArray = [1];
    const shuffledArray = shuffleArray(originalArray);
    expect(shuffledArray).toEqual([1]);
  });
});