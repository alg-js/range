/**
 * Every day I pray for <https://tc39.es/proposal-type-annotations/>
 */

import type {
  BoundConsumer,
  BoundMapping,
  BoundPredicate,
  Comparator,
  Consumer,
  Hashable,
  Mapping,
  Predicate,
  Reducer,
} from "./types.d.ts";

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
 * @param {number} step the step value
 * @returns {Range}
 * @throws {Error} if the step value is 0
 */
export function range(start: number, stop: number, step: number): Range;

/**
 * A range object. Most operations operate in constant time and space.
 */
export class Range implements Hashable<Range>, ArrayLike<number | undefined> {
  /** The start value of the range */
  readonly start: number;
  /** The stop value of the range */
  readonly stop: number;
  /** The step value of the range */
  readonly step: number;
  /** The number of items in the range */
  readonly length: number;
  /** A string representation of the range. */
  readonly [Symbol.toStringTag]: string;

  /**
   * Retrieves the element at the given index of this range.
   *
   * @example
   * ```javascript
   * const r = range(1, 10, 2);
   * console.log(r[2]);  // 5
   * ```
   *
   * @param {number} index
   * @returns {number|undefined}
   */
  readonly [index: number]: number | undefined;

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
   * @throws {Error} if the step value is 0
   */
  constructor(start: number, stop: number, step: number);

  /**
   * Retrieves the element at the given index of this range.
   *
   * @example
   * ```javascript
   * const r = range(1, 6, 2);
   * console.log(r.at(-1));  // 5
   * ```
   *
   * @param {number} index
   * @returns {number|undefined}
   */
  at(index: number): number | undefined;

  /**
   * Yields each element of the range and its index: [idx, elm]
   *
   * @exmaple
   * ```javascript
   * const r = range(5, 0, -1);
   * console.log(...r.entries());  // [0, 5] [1, 4] [2, 3] [3, 2] [4, 1]
   * ```
   *
   * @returns {Iterator<[number, number]>}
   */
  entries(): Iterator<[number, number]>;

  /**
   * Returns true if no value in the range contradicts the predicate
   *
   * @example
   * ```javascript
   * console.log(range(1, 5, 2).every((e) => e > 0));  // true
   * ```
   *
   * @param {Predicate} predicate
   * @returns {boolean}
   */
  every(
    predicate: Predicate,
  ): boolean;

  /**
   * Returns true if no value in the range contradicts the predicate.
   * Binds the predicate to `thisArg`
   *
   * @example
   * ```javascript
   * console.log(range(1, 5, 2).every((e) => e > 0));  // true
   * ```
   *
   * @template E
   * @param {BoundPredicate<E>} predicate
   * @param {E} thisArg
   * @returns {boolean}
   */
  every<E>(
    predicate: BoundPredicate<E>,
    thisArg: E,
  ): boolean;

  /**
   * Filters values in the range
   *
   * @example
   * ```javascript
   * console.log(range(10).filter((e) => e % 2 === 0));  // [0, 2, 4, 6, 8]
   * ```
   *
   * @param {Predicate} predicate
   * @returns {number[]}
   */
  filter(
    predicate: Predicate,
  ): number[];

  /**
   * Filters values in the range. Binds the predicate to `thisArg`
   *
   * @example
   * ```javascript
   * console.log(range(10).filter((e) => e % 2 === 0));  // [0, 2, 4, 6, 8]
   * ```
   *
   * @template E
   * @param {BoundPredicate<E>} predicate
   * @param {E} thisArg
   * @returns {number[]}
   */
  filter<E>(
    predicate: BoundPredicate<E>,
    thisArg: E,
  ): number[];

  /**
   * Finds the first element that satisfies the given predicate or undefined
   * if no element in the range satisfies the predicate.
   *
   * @example
   * ```javascript
   * const r = range(10);
   * console.log(r.find((e) => e >= 5));  // 5
   * ```
   *
   * @param {Predicate} predicate
   * @returns {number | undefined}
   */
  find(
    predicate: Predicate,
  ): number | undefined;

  /**
   * Finds the first element that satisfies the given predicate or undefined
   * if no element in the range satisfies the predicate. Binds the predicate
   * to `thisArg`
   *
   * @example
   * ```javascript
   * const r = range(10);
   * console.log(r.find((e) => e >= 5));  // 5
   * ```
   *
   * @template E
   * @param {BoundPredicate<E>} predicate
   * @param {E} thisArg
   * @returns {number | undefined}
   */
  find<E>(
    predicate: BoundPredicate<E>,
    thisArg: E,
  ): number | undefined;

  /**
   * Finds the last element that satisfies the given predicate or undefined
   * if no element in the range satisfies the predicate.
   *
   * @example
   * ```javascript
   * const r = range(10);
   * console.log(r.findLast((e) => e >= 5));  // 9
   * ```
   *
   * @param {Predicate} predicate
   * @returns {number | undefined}
   */
  findLast(
    predicate: Predicate,
  ): number | undefined;

  /**
   * Finds the last element that satisfies the given predicate or undefined
   * if no element in the range satisfies the predicate. Binds the predicate
   * to `thisArg`
   *
   * @example
   * ```javascript
   * const r = range(10);
   * console.log(r.findLast((e) => e >= 5));  // 9
   * ```
   *
   * @template E
   * @param {BoundPredicate<E>} predicate
   * @param {E} thisArg
   * @returns {number | undefined}
   */
  findLast<E>(
    predicate: BoundPredicate<E>,
    thisArg: E,
  ): number | undefined;

  /**
   * Finds the fist index of the element that satisfies the given predicate
   * or -1 if no element in the range satisfies the predicate.
   *
   * @example
   * ```javascript
   * const r = range(10);
   * console.log(r.findIndex((e) => e >= 5));  // 5
   * ```
   *
   * @param {Predicate} predicate
   * @returns {number}
   */
  findIndex(
    predicate: Predicate,
  ): number;

  /**
   * Finds the first index of the element that satisfies the given predicate
   * or -1 if no element in the range satisfies the predicate.
   * Binds the predicate to `thisArg`
   *
   * @example
   * ```javascript
   * const r = range(10);
   * console.log(r.findIndex((e) => e >= 5));  // 5
   * ```
   *
   * @template E
   * @param {BoundPredicate<E>} predicate
   * @param {E} thisArg
   * @returns {number}
   */
  findIndex<E>(
    predicate: BoundPredicate<E>,
    thisArg: E,
  ): number;

  /**
   * Finds the last index of the element that satisfies the given predicate
   * or -1 if no element in the range satisfies the predicate.
   *
   * @example
   * ```javascript
   * const r = range(10);
   * console.log(r.findLastIndex((e) => e >= 5));  // 9
   * ```
   *
   * @param {Predicate} predicate
   * @returns {number}
   */
  findLastIndex(
    predicate: Predicate,
  ): number;

  /**
   * Finds the last index of the element that satisfies the given predicate
   * or -1 if no element in the range satisfies the predicate.
   * Binds the predicate to `thisArg`
   *
   * @example
   * ```javascript
   * const r = range(10);
   * console.log(r.findLastIndex((e) => e >= 5));  // 9
   * ```
   *
   * @template E
   * @param {BoundPredicate<E>} predicate
   * @param {E} thisArg
   * @returns {number}
   */
  findLastIndex<E>(
    predicate: BoundPredicate<E>,
    thisArg: E,
  ): number;

  /**
   * Maps the values of the range using the given mapping function and
   * flattens any resulting arrays.
   *
   * @example
   * ```javascript
   * const r = range(3, 0, -1);
   * console.log(r.flatMap((e, i) => [i, e]));  // [0, 3, 1, 2, 2, 1]
   * ```
   *
   * @template V
   * @param {Mapping<V | V[]>} mapping
   * @returns {V[]}
   */
  flatMap<V>(
    mapping: Mapping<V | V[]>,
  ): V[];

  /**
   * Maps the values of the range using the given mapping function and
   * flattens any resulting arrays. Binds the mapping to `thisArg`.
   *
   * @example
   * ```javascript
   * const r = range(3, 0, -1);
   * console.log(r.flatMap((e, i) => [i, e]));  // [0, 3, 1, 2, 2, 1]
   * ```
   *
   * @template E
   * @template V
   * @param {BoundMapping<E, V | V[]>} mapping
   * @param {E} thisArg
   * @returns {V[]}
   */
  flatMap<E, V>(
    mapping: BoundMapping<E, V | V[]>,
    thisArg: E,
  ): V[];

  /**
   * Calls the consumer for each element in the range
   *
   * @example
   * ```javascript
   * const r = range(1, 4);
   * r.forEach((e) => console.log(e));  // 1 \ 2 \ 3
   * ```
   *
   * @param {Consumer} consumer
   * @returns {void}
   */
  forEach(
    consumer: Consumer,
  ): void;

  /**
   * Calls the consumer for each element in the range. Binds the consumer to
   * `thisArg`.
   *
   * @example
   * ```javascript
   * const r = range(1, 4);
   * r.forEach((e) => console.log(e));  // 1 \ 2 \ 3
   * ```
   *
   * @template E
   * @param {BoundConsumer<E>} consumer
   * @param {E} thisArg
   * @returns {void}
   */
  forEach<E>(
    consumer: BoundConsumer<E>,
    thisArg: E,
  ): void;

  /**
   * Returns true if the given element is in the range and false otherwise.
   *
   * @example
   * ```javascript
   * const r = range(0, 10, 2);
   * console.log(r.includes(4));  // true
   * console.log(r.includes(5));  // false
   * ```
   *
   * @param {number} searchElement
   * @returns {boolean}
   */
  includes(
    searchElement: number,
  ): boolean;

  /**
   * Returns true if the given element is in the range starting at the
   * given index and false otherwise.
   *
   * @example
   * ```javascript
   * const r = range(0, 10, 2);
   * console.log(r.includes(4, 2));  // true
   * console.log(r.includes(4, 3));  // false
   * ```
   *
   * @param searchElement
   * @param fromIndex
   * @returns {boolean}
   */
  includes(
    searchElement: number,
    fromIndex: number,
  ): boolean;

  /**
   * Returns the index of the given search element or -1 if it is not in the
   * range.
   *
   * @example
   * ```javascript
   * const r = range(0, 10, 2);
   * console.log(r.indexOf(4));  // 2
   * console.log(r.indexOf(5));  // -1
   * ```
   *
   * @param {number} searchElement
   * @returns {number}
   */
  indexOf(
    searchElement: number,
  ): number;

  /**
   * Returns the index of the given search element starting from the given
   * index or -1 if it is not in the range.
   *
   * @example
   * ```javascript
   * const r = range(0, 10, 2);
   * console.log(r.indexOf(4, 2));  // 2
   * console.log(r.indexOf(4, 3));  // -1
   * ```
   *
   * @param {number} searchElement
   * @param {number} fromIndex
   * @returns {number}
   */
  indexOf(
    searchElement: number,
    fromIndex: number,
  ): number;

  /**
   * Joins the values in the range using the given separator.
   * The default separator is ","
   *
   * @example
   * ```javascript
   * const r = range(5, 0, -1);
   * console.log(r.join("-"));  // 5-4-3-2-1
   * ```
   *
   * @param {?string} separator
   * @returns {string}
   */
  join(
    separator?: string,
  ): string;

  /**
   * An iterator over range indices
   *
   * @example
   * ```javascript
   * const r = range(5, 10);
   * console.log(...r.keys());  // 0 1 2 3 4
   * ```
   *
   * @returns {Iterator<number>}
   */
  keys(): Iterator<number>;

  /**
   * Returns the index of the given item or -1 if it is not in the range.
   *
   * @param {number} searchElement
   * @reutrns {number}
   */
  lastIndexOf(
    searchElement: number,
  ): number;

  /**
   * Returns the index of the given item or -1 if it is not in the range
   * starting from the given index and searching backwards.
   *
   * @param {number} searchElement
   * @param {number} fromIndex
   * @returns {number}
   */
  lastIndexOf(
    searchElement: number,
    fromIndex: number,
  ): number;

  /**
   * Maps the values of the range using the given mapping function.
   *
   * @example
   * ```javascript
   * const r = range(1, 4);
   * console.log(r.map((e) => "a".repeat(e)));  // ["a", "aa", "aaa"]
   * ```
   *
   * @template V
   * @param {Mapping<V>} mapping
   * @returns {V[]}
   */
  map<V>(
    mapping: Mapping<V>,
  ): V[];

  /**
   * Maps the values of the range using the given mapping function.
   * Binds the mapping function to `thisArg`.
   *
   * @example
   * ```javascript
   * const r = range(1, 4);
   * console.log(r.map((e) => "a".repeat(e)));  // ["a", "aa", "aaa"]
   * ```
   *
   * @template E
   * @template V
   * @param {BoundMapping<E, V>} mapping
   * @param {E} thisArg
   * @returns {V[]}
   */
  map<E, V>(
    mapping: BoundMapping<E, V>,
    thisArg: E,
  ): V[];

  /**
   * Reduces the current range
   *
   * @example
   * ```javascript
   * const result = range(11).reduce((a, e) => a + e);
   * console.log(result);  // 55
   * ```
   *
   * @param {Reducer<number>} reducer
   * @returns {number}
   */
  reduce(
    reducer: Reducer<number>,
  ): number;

  /**
   * Folds the current range
   *
   * @example
   * ```javascript
   * const result = range(11).reduce((a, e) => a + e, "");
   * console.log(result);  // 012345678910
   * ```
   *
   * @template T
   * @param {Reducer<number>} reducer
   * @param {T} initial
   * @returns {T}
   */
  reduce<T>(
    reducer: Reducer<T>,
    initial: T,
  ): T;

  /**
   * Right reduces the current range
   *
   * @example
   * ```javascript
   * const result = range(11).reduceRight((a, e) => a + e);
   * console.log(result);  // 55
   * ```
   *
   * @param {Reducer<number>} reducer
   * @returns {number}
   */
  reduceRight(
    reducer: Reducer<number>,
  ): number;

  /**
   * Right folds the current range
   *
   * @example
   * ```javascript
   * const result = range(11).reduceRight((a, e) => a + e, "");
   * console.log(result);  // 109876543210
   * ```
   *
   * @template T
   * @param {Reducer<number>} reducer
   * @param {T} initial
   * @returns {T}
   */
  reduceRight<T>(
    reducer: Reducer<T>,
    initial: T,
  ): T;

  /**
   * Returns a new range from slicing values in this range
   *
   * @param {number} start
   * @param {number} stop
   * @returns {Range}
   */
  slice(start?: number, stop?: number): Range;

  /**
   * Returns true if any item in the range satisfies the given predicate and
   * false otherwise.
   *
   * @example
   * ```javascript
   * const result1 = range(10).some(e => e % 2 === 0);
   * const result2 = range(1, 10, 2).some(e => e % 2 === 0);
   * console.log(result1, result2);  // true false
   * ```
   *
   * @param {Predicate} predicate
   * @returns {boolean}
   */
  some(
    predicate: Predicate,
  ): boolean;

  /**
   * Returns true if any item in the range satisfies the given predicate and
   * false otherwise.
   *
   * @example
   * ```javascript
   * const result1 = range(10).some(e => e % 2 === 0);
   * const result2 = range(1, 10, 2).some(e => e % 2 === 0);
   * console.log(result1, result2);  // true false
   * ```
   *
   * @template E
   * @param {BoundPredicate<E>} predicate
   * @param {E} thisArg
   * @returns {boolean}
   */
  some<E>(
    predicate: BoundPredicate<E>,
    thisArg: E,
  ): boolean;

  /**
   * Returns this range reversed.
   *
   * @returns {Range}
   */
  toReversed(): Range;

  /**
   * Sorts the elements in the range by their Unicode code points...
   *
   * @example
   * ```javascript
   * const scramble = range(-20, 21, 4).toSorted();
   * console.log(scramble); // [-12, -16, -20, -4, -8, 0, 12, 16, 20, 4, 8]
   * ```
   */
  toSorted(): number[];

  /**
   * Sorts the elements using the given comparator function.
   *
   * @example
   * ```javascript
   * const desc = range(-20, 21, 4).toSorted((a, b) => b - a);
   * console.log(desc);  // [20, 16, 12, 8, 4, 0, -4, -8, -12, -16, 20]
   * ```
   */
  toSorted(
    compareFn: Comparator,
  ): number[];

  /**
   * Splices the range from the given start index and removes `skipCount`
   * items from there.
   *
   * @example
   * ```javascript
   * const result = range(1, 11).toSpliced(3, 4);
   * console.log(result);  // [ 1, 2, 3, 8, 9, 10 ]
   * ```
   *
   * @param {number} start
   * @param {number} skipCount
   * @returns {number[]}
   */
  toSpliced<T>(
    start: number,
    skipCount: number,
  ): number[];

  /**
   * Splices the range from the given start index, removes `skipCount`
   * items from that index, and adds the given items.
   *
   * @example
   * ```javascript
   * const result = range(1, 11).toSpliced(3, 4, "a", "b", "c");
   * console.log(result);  // [ 1, 2, 3, "a", "b", "c", 8, 9, 10 ]
   * ```
   *
   * @template T
   * @param {number} start
   * @param {number} skipCount
   * @param {T[]} items
   * @returns {(number | T)[]}
   */
  toSpliced<T>(
    start: number,
    skipCount: number,
    ...items: T[]
  ): (number | T)[];

  /**
   * Iterates over values in this range
   *
   * @example
   * ```javascript
   * const result = range(5).values();
   * console.log(...result);  // 0 1 2 3 4
   * ```
   *
   * @returns {Iterator<number>}
   */
  values(): Iterator<number>;

  /**
   * Returns `true` if two ranges are considered equal.
   *
   * Two ranges are considered equal if they produce the same values in the
   * same order.
   *
   * @returns {boolean}
   */
  equals(other: Range): boolean;

  /**
   * Returns a hash value for the range
   *
   * @returns {number}
   */
  hash(): number;

  /**
   * Returns a string representation of the range.
   */
  toString(): string;

  /**
   * Iterates over values in this range
   * @returns {Generator<number, void, void>}
   */
  [Symbol.iterator](): Generator<number, void, void>;
}
