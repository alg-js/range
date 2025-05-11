import {
    assert,
    assertEquals,
    assertFalse,
    assertThrows,
} from "jsr:@std/assert@1";
import fc from "npm:fast-check";
import {range} from "@alg/range";
import {
    alph,
    assertBigRanges,
    assertEquivalent,
    assertEquivalentIter,
    assertSmallRanges, bang,
} from "./utils.js";

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
    name: "Ranges can be contiguous",
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
    name: "Ranges can have gaps",
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
    name: "Ranges have lengths",
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
    name: "Ranges have entries",
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
                assertEquals([...asc.entries()], [...[...asc].entries()]);
                assertEquals([...dec.entries()], [...[...dec].entries()]);
            },
        ));
    },
});


Deno.test({
    name: "Ranges have every",
    fn: () => {
        assertSmallRanges((r) => {
            let fns = [
                (e) => e % 2 === 0,
                (e, i) => (e * i) % 2 === 0,
                (e, i, rng) => (e * i * rng[0]) % 2 === 0,
            ];
            for (const fn of fns) {
                assertEquivalent(r, (e) => e.every(fn));
            }
        });
    },
});


Deno.test({
    name: "Ranges can be filtered",
    fn: () => {
        assertSmallRanges((range) => {
            let fns = [
                (e) => e % 2 === 0,
                (e, i) => (e + i) % 2 === 0,
                (e, i, rng) => (e + i + rng[0]) % 2 === 0,
            ];
            for (const fn of fns) {
                assertEquivalent(range, (e) => e.filter(fn));
            }
        });
    },
});


Deno.test({
    name: "Values can be found in ranges",
    fn: () => {
        assertSmallRanges((range) => {
            const middle = range[Math.floor(range.length / 2)];
            let fns = [
                (e) => e === middle,
                (e, i) => range[i + 1] === middle,
                (e, i, rng) => rng[i + 1] === middle,
                () => false,
            ];
            for (const fn of fns) {
                assertEquivalent(range, (e) => e.find(fn));
                assertEquivalent(range, (e) => e.findLast(fn));
                assertEquivalent(range, (e) => e.findIndex(fn));
                assertEquivalent(range, (e) => e.findLastIndex(fn));
            }
        });
    },
});


Deno.test({
    name: "Ranges can be flatmapped",
    fn: () => {
        assertSmallRanges((range) => {
            const data = [
                "foo", "bar", "baz", [..."foo"], [..."bar"], [..."baz"],
            ];
            assertEquivalent(
                range,
                (r) => r.flatMap((e) => data[((e % 6) + 6) % 6]),
            );
        });
    },
});


Deno.test({
    name: "Ranges have includes",
    fn: () => {
        assertSmallRanges((range) => fc.assert(fc.property(
            fc.integer({min: -range.length - 1, max: range.length}),
            fc.integer(
                range.at(0) < range.at(-1)
                    ? {min: range.at(0) - 1, max: range.at(-1) + 1}
                    : {min: range.at(-1) - 1, max: range.at(0) + 1},
            ),
            (idx, val) => assertEquivalent(range, (r) => r.includes(val, idx)),
        )));
    },
});


Deno.test({
    name: "Ranges have indexof",
    fn: () => {
        assertSmallRanges((range) => fc.assert(fc.property(
            fc.integer({min: -range.length - 1, max: range.length}),
            fc.integer(
                range.at(0) < range.at(-1)
                    ? {min: range.at(0) - 1, max: range.at(-1) + 1}
                    : {min: range.at(-1) - 1, max: range.at(0) + 1},
            ),
            (idx, val) => {
                assertEquivalent(range, (r) => r.indexOf(val, idx));
                assertEquivalent(range, (r) => r.lastIndexOf(val, idx));
            },
        )));
    },
});

Deno.test({
    name: "Ranges can do foreach",
    fn: () => {
        assertSmallRanges((range) => {
            const result = [];
            range.forEach((e) => result.push(e));
            assertEquals([...range], result);
        });
    },
});

Deno.test({
    name: "Ranges can be joined",
    fn: () => {
        assertSmallRanges((range) => {
            assertEquivalent(range, (r) => r.join());
            fc.assert(fc.property(
                fc.string({minLength: 0, maxLength: 5}),
                (str) => assertEquivalent(range, (r) => r.join(str)),
            ));
        });
    },
});

Deno.test({
    name: "Ranges have keys",
    fn: () => assertSmallRanges(
        (r) => assertEquivalentIter(r, (e) => e.keys()),
    ),
});

Deno.test({
    name: "Ranges can be mapped",
    fn: () => assertSmallRanges((r) => assertEquivalentIter(
        r,
        (e) => e.map((e1) => e1 ** 2),
    )),
});

Deno.test({
    name: "Ranges can be reduced",
    fn: () => {
        const getMax = (a, b) => Math.max(a, b);
        assertEquals(range(1, 101).reduce(getMax, 50), 100);
        assertEquals(range(50, 51).reduce(getMax, 10), 50);
        assertEquals(range(1, 101).reduce(getMax), 100);
        assertEquals(range(50, 51).reduce(bang), 50);
        assertEquals(range(50, 50).reduce(bang, 1), 1);
        assertThrows(() => range(50, 50).reduce(bang));
        assertEquals(range(5).reduce((a, e) => "" + a + e), "01234");
    },
});

Deno.test({
    name: "Ranges can be reducedRight",
    fn: () => {
        const getMax = (a, b) => Math.max(a, b);
        assertEquals(range(1, 101).reduceRight(getMax, 50), 100);
        assertEquals(range(50, 51).reduceRight(getMax, 10), 50);
        assertEquals(range(1, 101).reduceRight(getMax), 100);
        assertEquals(range(50, 51).reduceRight(bang), 50);
        assertEquals(range(50, 50).reduceRight(bang, 1), 1);
        assertThrows(() => range(50, 50).reduceRight(bang));
        assertEquals(range(5).reduceRight((a, e) => "" + a + e), "43210");
    },
});

Deno.test({
    name: "Ranges have some",
    fn: () => assertSmallRanges((r) => {
        let fns = [
            (e) => e % 2 === 0,
            (e, i) => (e * i) % 2 === 0,
            (e, i, rng) => (e * i * rng[0]) % 2 === 0,
        ];
        for (const fn of fns) {
            assertEquivalent(r, (e) => e.some(fn));
        }
    }),
});

Deno.test({
    name: "Ranges can be reversed",
    fn: () => {
        assertBigRanges((range) => {
            assertEquivalentIter(range, (e) => e.toReversed());
            assertEquivalentIter(
                range,
                (e) => e.toReversed().toReversed(),
            );
        });
    },
});

Deno.test({
    name: "Ranges can be sorted",
    fn: () => {
        assertSmallRanges((range) => {
            assertEquivalentIter(range, (e) => e.toSorted());
            assertEquivalentIter(range, (e) => e.toSorted((l, r) => l - r));
            assertEquivalentIter(range, (e) => e.toSorted((l, r) => r - l));
        });
    },
});

Deno.test({
    name: "Ranges can be spliced",
    fn: () => {
        assertSmallRanges((r) => fc.assert(fc.property(
            fc.integer({min: 0, max: r.length}),
            fc.integer({min: 0, max: r.length}),
            fc.integer({min: 0, max: 26}),
            (start, skip, items) => {
                assertEquivalentIter(
                    r, (arr) => arr.toSpliced(start, skip, ...alph(items)),
                );
                assertEquivalentIter(r, (arr) => arr.toSpliced(start, skip));
            },
        )));
    },
});

Deno.test({
    name: "Ranges can be indexed",
    fn: () => {
        assertSmallRanges((range) => {
            fc.assert(
                fc.property(
                    fc.integer({min: -range.length - 1, max: range.length}),
                    (i) => {
                        assertEquivalent(range, (e) => e.at(i));
                        assertEquivalent(range, (e) => e[i]);
                    },
                ), {numRuns: 10});
        });
    },
});

Deno.test({
    name: "Ranges have values",
    fn: () => {
        assertSmallRanges((range) => {
            assertEquivalentIter(range, (e) => e.values());
        });
    },
});

Deno.test({
    name: "Ranges can be sliced",
    fn: () => {
        assertBigRanges((range) => {
            fc.assert(fc.property(
                fc.integer({min: -range.length - 1, max: range.length}),
                fc.integer({min: -range.length - 1, max: range.length}),
                (i, j) => {
                    assertEquivalentIter(range, (e) => e.slice(i, j));
                    assertEquivalentIter(range, (e) => e.slice(i));
                    assertEquivalentIter(range, (e) => e.slice(undefined, j));
                },
            ), {numRuns: 20});
        }, {numRuns: 20});
    },
});

Deno.test({
    name: "Ranges are hashable",
    fn: () => {
        assertBigRanges((r) => {
            const r1 = range(r.start, r.stop + 1, r.step);
            const r2 = range(r.start, r.stop + 2, r.step);
            fc.pre(r.at(-1) === r1.at(-1) && r.at(-1) === r2.at(-1));
            assertEquals(r.hash(), r1.hash());
            assertEquals(r.hash(), r2.hash());
            assert(r.equals(r1));
            assert(r.equals(r2));
        });
        assertBigRanges((r) => {
            const r1 = range(r.start, r.stop + 1, r.step);
            fc.pre(r.at(-1) !== r1.at(-1));
            assertFalse(r.equals(r1));
            assertFalse(r.equals(range(r.start + 1, r.stop, r.step)));
            if (r.step !== -1) {
                assertFalse(r.equals(range(r.start, r.stop, r.step + 1)));
            } else {
                assertFalse(r.equals(range(r.start, r.stop, r.step - 1)));
            }
        });
    },
});

Deno.test({
    name: "Ranges can be turned into strings",
    fn: () => assertBigRanges((r) => assertEquals(
        r.toString(),
        `range(${r.start}, ${r.stop}, ${r.step})`,
    )),
});

Deno.test({
    name: "Range objects can be turned into strings",
    fn: () => assertBigRanges((r) => assertEquals(
        Object.prototype.toString.call(r),
        `[object range(${r.start}, ${r.stop}, ${r.step})]`,
    )),
});
