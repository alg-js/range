/**
 * Every day I pray for <https://tc39.es/proposal-type-annotations/>
 */

interface Hashable<T> {
  hash(): number;
  equals(other: T): boolean;
}

/**
 * Creates a range with the given stop value
 *
 * @param {number} stop the stop value
 * @returns {Range}
 */
export function range(stop: number): Range;

/**
 * Creates a range with the given start, and stop values
 *
 * @param {number} start the start value
 * @param {number} stop the stop value
 * @returns {Range}
 */
export function range(start: number, stop: number): Range;

/**
 * Creates a range with the given start, stop, and step values
 *
 * @param {number} start the start value
 * @param {number} stop the stop value
 * @param {number} step the stop value
 * @returns {Range}
 * @throws {Error} if the step value is 0
 */
export function range(start: number, stop: number, step: number): Range;

/**
 * A range object. Most operations operate in constant time and space.
 */
export class Range implements Hashable<Range> {
  /**
   * Creates a range with the given stop value
   *
   * @param {number} stop the stop value
   */
  constructor(stop: number);
  /**
   * Creates a range with the given start, and stop values
   *
   * @param {number} start the start value
   * @param {number} stop the stop value
   */
  constructor(start: number, stop: number);
  /**
   * Creates a range with the given start, stop, and step values
   *
   * @param {number} start the start value
   * @param {number} stop the stop value
   * @param {number} step the stop value
   */
  constructor(start: number, stop: number, step: number);
  /**
   * Retrieves the element at the given index of this range.
   * @param {number} index
   * @returns {number|undefined}
   */
  at(index: number): number | undefined;
  /**
   * Retrieves the element at the given index of this range.
   * @param {number} index
   * @returns {number|undefined}
   */
  [index: number]: number | undefined;
  /**
   * Returns a new range from slicing values in this range
   *
   * @param {number|null} start
   * @param {number|null} stop
   * @returns {Range}
   */
  slice(start?: number | null, stop?: number | null): Range;
  /**
   * Returns this range reversed.
   *
   * @returns {Range}
   */
  toReversed(): Range;
  /**
   * Returns true if this range equals another range
   * @returns {boolean}
   */
  equals(other: Range): boolean;
  /**
   * Returns a hash for the given range
   * @returns {number}
   */
  hash(): number;
  /**
   * Iterates over values in this range
   * @returns {Generator<number, void, void>}
   */
  [Symbol.iterator](): Generator<number, void, void>;
}
