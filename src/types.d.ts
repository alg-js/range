import type { Range } from "./main.js";

/**
 * An interface for hashable objects
 */
export interface Hashable {
  hash(): number;
  equals(other: unknown): boolean;
}

/** A comparator function */
export type Comparator = (a: number, b: number) => number;

/** A predicate function */
export type Predicate = (value: number, index: number, range: Range) => unknown;

/** A predicate function with `this` bound to a value */
export type BoundPredicate<T> = (
  this: T,
  value: number,
  index: number,
  range: Range,
) => unknown;

/** A mapping function */
export type Mapping<V> = (value: number, index: number, range: Range) => V;

/** A mapping function with `this` bound to a value */
export type BoundMapping<T, V> = (
  this: T,
  value: number,
  index: number,
  range: Range,
) => V;

/** A consumer function */
export type Consumer = (value: number, index: number, range: Range) => void;

/** A consumer function with `this` bound to a value */
export type BoundConsumer<T> = (
  this: T,
  value: number,
  index: number,
  range: Range,
) => void;

/** A reducer/folding function */
export type Reducer<T> = (
  accumulator: T,
  value: number,
  index: number,
  range: Range,
) => void;
