# @alg/range

[![JSR](https://jsr.io/badges/@alg/range)](https://jsr.io/@alg/range)
[![License](https://img.shields.io/badge/MIT-green?label=license)](https://github.com/alg-js/range/blob/main/LICENSE)

A range function.

Ranges are immutable. All operations excluding iterative methods operate in
O(1) time and space.

## Install

```
deno add jsr:@alg/range
```

## Example

Range implements most non-mutating array methods.
See the [API docs](https://jsr.io/@alg/range/doc/~/Range) for more.

```javascript
import {range} from "@alg/range";

const r = range(5); // or new Range(5);
console.log([...r]); // [0, 1, 2, 3, 4]
console.log(r.at(-2)); // 3
console.log(r[3]); // 3
console.log([...r.toReversed()]); // [4, 3, 2, 1, 0]
console.log([...r.slice(1, -1)]); // [1, 2, 3]
console.log([...r.reduce((a, e) => a + e)]); // 10

console.log([...range(1, 5)]); // [1, 2, 3, 4]
console.log([...range(1, 5, 2)]); // [1, 3]
console.log([...range(5, 1, -2)]); // [5, 3]
```
