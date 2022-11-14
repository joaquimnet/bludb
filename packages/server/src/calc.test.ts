import { calc } from '.';

describe('Calc tests', () => {
  test('should calculate', () => {
    expect(calc(3, 5)).toBe(15);
  });
});
