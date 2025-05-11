import {assertEquals} from "jsr:@std/assert@1";
import fc from "npm:fast-check";
import {Range} from "@alg/range";

function assertIterEquals(iter1, iter2) {
    assertEquals([...iter1], [...iter2]);
}

export function assertSmallRanges(fn, options) {
    fc.assert(fc.property(
            fc.integer({min: -10, max: 10}),
            fc.integer({min: -10, max: 10}),
            fc.integer({min: 1, max: 5}),
            (start, stop, step) => {
                [start, stop] = [Math.min(start, stop), Math.max(start, stop)];
                fc.pre(step < stop - start);
                fn(new Range(start, stop, step));
                fn(new Range(stop, start, -step));
            },
        ),
        options,
    );
}

export function assertBigRanges(fn, options) {
    fc.assert(fc.property(
        fc.integer({min: -100, max: 100}),
        fc.integer({min: -100, max: 100}),
        fc.integer({min: 1, max: 5}),
        (start, stop, step) => {
            [start, stop] = [Math.min(start, stop), Math.max(start, stop)];
            fc.pre(step < stop - start);
            fn(new Range(start, stop, step));
            fn(new Range(stop, start, -step));
        },
    ), options);
}

export function assertEquivalent(range, func) {
    assertEquals(func(range), func([...range]));
}

export function assertEquivalentIter(range, func) {
    assertIterEquals(func(range), func([...range]));
}

export function bang() {
    throw new Error("This function throws an error! Yippee!!");
}

export function alph(n) {
    return "abcdefghijklmnopqrstuvwxyz".slice(0, n)[Symbol.iterator]();
}

