import {assertEquals, assertThrows} from "@std/assert";
import {randomIntegerBetween} from "@std/random";
import {range, Range} from "@alg/range";

function randomRange(lower = -150, upper = 150) {
    const overlap = upper - lower / 3
    const start = randomIntegerBetween(lower, upper - overlap);
    const stop = randomIntegerBetween(lower + overlap, upper);
    const step = start < stop
        ? randomIntegerBetween(1, 10)
        : randomIntegerBetween(-10, -1);
    return range(start, stop, step);
}

function rangeStringify(data) {
    return JSON.stringify(
        data, (_, value) =>
            value instanceof Range
                ? `range(${value.start}, ${value.stop}, ${value.step})`
                : value,
    );
}

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

const contiguousRangeCases = [
    {range: range(1), expected: [0]},
    {range: range(1, 3), expected: [1, 2]},
    {range: range(4), expected: [0, 1, 2, 3]},
    {range: range(1, 5), expected: [1, 2, 3, 4]},
    {range: range(5, 1, -1), expected: [5, 4, 3, 2]},
    {range: range(-1, -5, -1), expected: [-1, -2, -3, -4]},
];
for (const test of contiguousRangeCases) {
    Deno.test({
        name: `Ranges can be contiguous: ${rangeStringify(test)}`,
        fn: () => {
            assertEquals([...test.range], test.expected);
            assertEquals(test.range.length, test.expected.length);
        },
    });
}

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
    Deno.test({
        name: `Ranges can have gaps: ${rangeStringify(test)}`,
        fn: () => {
            assertEquals([...test.range], test.expected);
            assertEquals(test.range.length, test.expected.length);
        },
    });
}

for (let i = 0; i < 100; i++) {
    const r = randomRange();
    Deno.test({
        name: `Ranges have lengths: ${rangeStringify(r)}`,
        fn: () => {
            const arr = [...r];
            assertEquals(r.length, arr.length);
        },
    });
}

for (let i = 0; i < 100; i++) {
    const r = randomRange();
    Deno.test({
        name: `Ranges can be reversed: ${rangeStringify(r)}`,
        fn: () => {
            assertEquals([...r.toReversed()], [...r].toReversed());
            assertEquals([...r.toReversed().toReversed()], [...r]);
        },
    });
}

for (let i = 0; i < 10; i++) {
    const r = randomRange();
    for (let j = -r.length - 2; j < r.length + 1; j++) {
        Deno.test({
            name: `Ranges can be indexed (.at): ${rangeStringify(r)}.at(${j})`,
            fn: () => {
                const arr = [...r];
                assertEquals(r.at(j), arr.at(j));
            },
        });
    }
}

for (let i = 0; i < 3; i++) {
    const r = randomRange(-6, 6);
    for (let j = -r.length - 2; j < r.length + 1; j++) {
        for (let k = -r.length - 2; k < r.length + 1; k++) {
            Deno.test({
                name: `Ranges can be sliced: ${rangeStringify(r)}.slice(${j}, ${k})`,
                fn: () => {
                    const arr = [...r];
                    assertEquals([...r.slice(j, k)], arr.slice(j, k));
                    assertEquals([...r.slice(j)], arr.slice(j));
                    assertEquals([...r.slice(null, k)], arr.slice(null, k));
                },
            });
        }
    }
}