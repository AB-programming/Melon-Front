import { numberDisplay } from '@/utils/conversion';

describe('numberDisplay', () => {
  it('returns number as string when less than 1000', () => {
    expect(numberDisplay(0)).toBe('0');
    expect(numberDisplay(999)).toBe('999');
  });

  it('returns k format when between 1000 and 9999 divisible by 1000', () => {
    expect(numberDisplay(1000)).toBe('1k');
    expect(numberDisplay(2000)).toBe('2k');
    expect(numberDisplay(9000)).toBe('9k');
  });

  it('returns k format with one decimal when between 1000 and 9999 not divisible', () => {
    expect(numberDisplay(1234)).toBe('1.2k');
    expect(numberDisplay(9999)).toBe('9.9k');
  });

  it('returns w format when between 10000 and 999999 divisible by 10000', () => {
    expect(numberDisplay(10000)).toBe('1w');
    expect(numberDisplay(900000)).toBe('90w');
  });

  it('returns w format with one decimal when between 10000 and 999999 not divisible', () => {
    expect(numberDisplay(12345)).toBe('1.2w');
    expect(numberDisplay(999999)).toBe('99.9w');
  });

  it('returns 100w+ when greater than or equal to 1000000', () => {
    expect(numberDisplay(1000000)).toBe('100w+');
    expect(numberDisplay(99999999)).toBe('100w+');
  });
});
