import {assertEquals, assertThrows, assert, assertFalse} from "jsr:@std/assert@1";
import fc from "npm:fast-check";
import {range} from "@alg/range";


Deno.test({
    name: "Ranges can be empty",
    fn: () => {
        assertEquals([...range(0)], []);
        assertEquals(range(0).length, 0);
        assertEquals([...range(1, 1)], []);
        assertEquals(range(1, 1).length, 0);
        assertEquals([...range(-1, -1)], []);
        assertEquals(range(-1, -1).length, 0);
    },
});

Deno.test({
    name: "Ranges are immutable",
    fn: () => {
        const r = range(1, 10, 2);
        assertThrows(() => r.start = 2);
        assertThrows(() => r.stop = 2);
        assertThrows(() => r.step = 2);
        assertThrows(() => r.length = 2);
        assertThrows(() => r[0] = 2);
    },
});

Deno.test({
    name: "Crossed over start and stop values produce empty ranges",
    fn: () => {
        const r1 = range(3, 1);
        assertEquals(r1.length, 0);
        assertEquals([...r1], []);
        const r2 = range(1, 3, -1);
        assertEquals(r2.length, 0);
        assertEquals([...r2], []);
    },
});

Deno.test({
    name: "Ranges cannot have a step size of 0",
    fn: () => {
        assertThrows(() => range(0, 1, 0));
    },
});


Deno.test({
    name: `Ranges can be contiguous`,
    fn: () => {
        const contiguousRangeCases = [
            {range: range(1), expected: [0]},
            {range: range(1, 3), expected: [1, 2]},
            {range: range(4), expected: [0, 1, 2, 3]},
            {range: range(1, 5), expected: [1, 2, 3, 4]},
            {range: range(5, 1, -1), expected: [5, 4, 3, 2]},
            {range: range(-1, -5, -1), expected: [-1, -2, -3, -4]},
        ];
        for (const test of contiguousRangeCases) {
            assertEquals([...test.range], test.expected);
            assertEquals(test.range.length, test.expected.length);
        }
    },
});


Deno.test({
    name: `Ranges can have gaps`,
    fn: () => {
        const gapRangeCases = [
            {range: range(0, 4, 2), expected: [0, 2]},
            {range: range(0, 5, 2), expected: [0, 2, 4]},
            {range: range(1, 7, 3), expected: [1, 4]},
            {range: range(1, 8, 3), expected: [1, 4, 7]},
            {range: range(1, 9, 3), expected: [1, 4, 7]},
            {range: range(0, -4, -2), expected: [0, -2]},
            {range: range(0, -5, -2), expected: [0, -2, -4]},
            {range: range(0, -6, -2), expected: [0, -2, -4]},
            {range: range(1, -7, -3), expected: [1, -2, -5]},
            {range: range(1, -8, -3), expected: [1, -2, -5]},
            {range: range(1, -9, -3), expected: [1, -2, -5, -8]},
        ];
        for (const test of gapRangeCases) {
            assertEquals([...test.range], test.expected);
            assertEquals(test.range.length, test.expected.length);
        }
    },
});

Deno.test({
    name: `Ranges have lengths`,
    fn: () => {
        fc.assert(fc.property(
            fc.integer({min: -100, max: 100}),
            fc.integer({min: -100, max: 100}),
            fc.integer({min: 1, max: 5}),
            (start, stop, step) => {
                [start, stop] = [Math.min(start, stop), Math.max(start, stop)];
                fc.pre(step < stop - start);
                const asc = range(start, stop, step);
                const dec = range(stop, start, -step);
                assertEquals(asc.length, [...asc].length);
                assertEquals(dec.length, [...dec].length);
            },
        ));
    },
});

Deno.test({
    name: "Ranges can be reversed",
    fn: () => {
        fc.assert(fc.property(
            fc.integer({min: -100, max: 100}),
            fc.integer({min: -100, max: 100}),
            fc.integer({min: 1, max: 5}),
            (start, stop, step) => {
                [start, stop] = [Math.min(start, stop), Math.max(start, stop)];
                fc.pre(step < stop - start);
                const asc = range(start, stop, step);
                const dec = range(stop, start, -step);
                assertEquals([...asc.toReversed()], [...asc].toReversed());
                assertEquals([...dec.toReversed()], [...dec].toReversed());
                assertEquals([...asc.toReversed().toReversed()], [...asc]);
                assertEquals([...dec.toReversed().toReversed()], [...dec]);
            },
        ));
    },
});

Deno.test({
    name: "Ranges can be indexed",
    fn: () => {
        fc.assert(fc.property(
            fc.integer({min: -100, max: 100}),
            fc.integer({min: -100, max: 100}),
            fc.integer({min: 1, max: 5}),
            fc.integer(),
            (start, stop, step, i) => {
                [start, stop] = [Math.min(start, stop), Math.max(start, stop)];
                fc.pre(step < stop - start);
                const asc = range(start, stop, step);
                fc.pre(-1 <= i && i <= asc.length);
                const ascArr = [...asc];
                const dec = range(stop, start, -step);
                const decArr = [...dec];
                assertEquals(asc.at(i), ascArr.at(i));
                assertEquals(dec.at(i), decArr.at(i));
                assertEquals(asc[i], ascArr[i]);
                assertEquals(dec[i], decArr[i]);
            },
        ));
    },
});

Deno.test({
    name: "Ranges can be sliced",
    fn: () => {
        fc.assert(fc.property(
            fc.integer({min: -100, max: 100}),
            fc.integer({min: -100, max: 100}),
            fc.integer({min: 1, max: 5}),
            fc.integer({min: -50, max: 50}),
            fc.integer({min: -50, max: 50}),
            (start, stop, step, i, j) => {
                [start, stop] = [Math.min(start, stop), Math.max(start, stop)];
                fc.pre(step < stop - start);
                const asc = range(start, stop, step);
                fc.pre(-2 <= i && i <= asc.length);
                fc.pre(-2 <= j && j <= asc.length);
                const ascArr = [...asc];
                const dec = range(stop, start, -step);
                const decArr = [...dec];
                assertEquals([...asc.slice(i, j)], ascArr.slice(i, j));
                assertEquals([...asc.slice(i)], ascArr.slice(i));
                assertEquals([...asc.slice(null, j)], ascArr.slice(null, j));
                assertEquals([...dec.slice(i, j)], decArr.slice(i, j));
                assertEquals([...dec.slice(i)], decArr.slice(i));
                assertEquals([...dec.slice(null, j)], decArr.slice(null, j));
            },
        ));
    },
});


Deno.test({
    name: "Ranges are hashable",
    fn: () => {
        fc.assert(fc.property(
            fc.integer({min: -100, max: 100}),
            fc.integer({min: -100, max: 100}),
            fc.integer({min: 5, max: 10}),
            fc.integer({min: -50, max: 50}),
            fc.integer({min: -50, max: 50}),
            (start, stop, step) => {
                [start, stop] = [Math.min(start, stop), Math.max(start, stop)];
                const r1 = range(start, stop, step);
                const r2 = range(start, stop + 1, step);
                const r3 = range(start, stop + 2, step);
                const r4 = range(start + 1, stop, step);
                fc.pre(r1.at(-1) === r2.at(-1) && r1.at(-1) === r3.at(-1));
                assertEquals(r1.hash(), r2.hash());
                assertEquals(r1.hash(), r3.hash());
                assert(r1.equals(r2));
                assert(r1.equals(r3));
                assertFalse(r4.equals(r3));
            },
        ));
    },
});
