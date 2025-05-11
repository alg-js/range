/* @ts-self-types="./main.d.ts" */

export function range(start, stop, step) {
    return new Range(start, stop, step);
}


export class Range {
    constructor(start, stop, step) {
        if (step === 0) {
            throw new Error("range step value cannot be 0");
        }
        [start, stop, step] = normalizeParams(start, stop, step);
        const len = length(start, stop, step);
        Object.defineProperty(this, "start", {value: start});
        Object.defineProperty(this, "stop", {value: stop});
        Object.defineProperty(this, "step", {value: step});
        Object.defineProperty(this, "length", {value: len});
        return new Proxy(this, arrayLike);
    }

    at(index) {
        if (index < -this.length || index >= this.length) {
            return undefined;
        } else if (index < 0) {
            return this.start + this.step * (index + this.length);
        } else {
            return this.start + this.step * index;
        }
    }

    * entries() {
        for (let i = 0; i < this.length; i++) {
            yield [i, this.at(i)];
        }
    }

    every(predicate, thisArg) {
        let result = true;
        for (let i = 0; result && i < this.length; i++) {
            result = result && predicate.call(thisArg, this.at(i), i, this);
        }
        return result;
    }

    filter(predicate, thisArg) {
        const result = [];
        for (let i = 0; i < this.length; i++) {
            if (predicate.call(thisArg, this.at(i), i, this)) {
                result.push(this.at(i));
            }
        }
        return result;
    }

    find(predicate, thisArg) {
        for (let i = 0; i < this.length; i++) {
            if (predicate.call(thisArg, this.at(i), i, this)) {
                return this.at(i);
            }
        }
    }

    findLast(predicate, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (predicate.call(thisArg, this.at(i), i, this)) {
                return this.at(i);
            }
        }
    }

    findIndex(predicate, thisArg) {
        for (let i = 0; i < this.length; i++) {
            if (predicate.call(thisArg, this.at(i), i, this)) {
                return i;
            }
        }
        return -1;
    }

    findLastIndex(predicate, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (predicate.call(thisArg, this.at(i), i, this)) {
                return i;
            }
        }
        return -1;
    }

    flatMap(mapping, thisArg) {
        const result = [];
        for (let i = 0; i < this.length; i++) {
            const value = mapping.call(thisArg, this.at(i), i, this);
            if (value instanceof Array) {
                result.push(...value);
            } else {
                result.push(value);
            }
        }
        return result;
    }

    forEach(consumer, thisArg) {
        for (let i = 0; i < this.length; i++) {
            consumer.call(thisArg, this.at(i), i, this);
        }
    }

    includes(searchElement, fromIndex) {
        return this.indexOf(searchElement, fromIndex) !== -1;
    }

    indexOf(searchElement, fromIndex) {
        if (fromIndex >= this.length || this.length === 0) {
            return -1;
        }

        if (fromIndex === undefined || fromIndex < -this.length) {
            fromIndex = 0;
        } else if (-this.length <= fromIndex && fromIndex < 0) {
            fromIndex += this.length;
        }

        const idx = (searchElement - this.start) / this.step;
        const rem = (searchElement - this.start) % this.step;
        if (rem === 0 && fromIndex <= idx && idx < this.length) {
            return idx;
        } else {
            return -1;
        }
    }

    join(separator = ",") {
        return [...this].join(separator);
    }

    * keys() {
        for (let i = 0; i < this.length; i++) {
            yield i;
        }
    }

    lastIndexOf(searchElement, fromIndex) {
        if (fromIndex < -this.length || this.length === 0) {
            return -1;
        }

        if (fromIndex === undefined || fromIndex >= this.length) {
            fromIndex = this.length - 1;
        } else if (-this.length <= fromIndex && fromIndex < 0) {
            fromIndex += this.length;
        }

        const idx = (searchElement - this.start) / this.step;
        const rem = (searchElement - this.start) % this.step;
        if (rem === 0 && 0 <= idx && idx <= fromIndex) {
            return idx;
        } else {
            return -1;
        }
    }

    map(mapping, thisArg) {
        const result = [];
        for (let i = 0; i < this.length; i++) {
            result.push(mapping.call(thisArg, this.at(i), i, this));
        }
        return result;
    }

    reduce(reducer, initial) {
        if (initial === undefined && this.length === 0) {
            throw new TypeError("Reduce of empty range with no initial value");
        }
        let i = 0;
        if (initial === undefined) {
            initial = this[0];
            i = 1;
        }
        for (; i < this.length; i++) {
            initial = reducer(initial, this[i], i, this);
        }
        return initial;
    }

    reduceRight(reducer, initial) {
        if (initial === undefined && this.length === 0) {
            throw new TypeError("Reduce of empty range with no initial value");
        }
        let i = this.length - 1;
        if (initial === undefined) {
            initial = this.at(-1);
            i -= 1;
        }
        for (; i >= 0; i--) {
            initial = reducer(initial, this[i], i, this);
        }
        return initial;
    }

    slice(start, stop) {
        [start, stop] = normalizeSlice(start, stop, this.length);
        return range(
            this.start + (this.step * start),
            this.start + (this.step * stop),
            this.step,
        );
    }

    some(predicate, thisArg) {
        for (let i = 0; i < this.length; i++) {
            if (predicate.call(thisArg, this[i], i, this)) {
                return true;
            }
        }
        return false;
    }

    toReversed() {
        return new Range(
            this.start + this.step * (this.length - 1),
            this.start - this.step,
            -this.step,
        );
    }

    toSorted(compareFn) {
        const result = [...this];
        if (compareFn === undefined) {
            result.sort();
        } else {
            result.sort(compareFn);
        }
        return result;
    }

    toSpliced(start, skipCount, ...items) {
        const result = [...this];
        result.splice(start, skipCount, ...items);
        return result;
    }

    values() {
        return this[Symbol.iterator]();
    }

    equals(other) {
        return other instanceof Range
            && this.at(0) === other.at(0)
            && this.at(-1) === other.at(-1)
            && this.step === other.step;
    }

    hash() {
        let result = this.start;
        result = 31 * result + (this.at(-1) || 0);
        result = 31 * result + this.step;
        return result;
    }

    toString() {
        return this[Symbol.toStringTag];
    }

    * [Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this.start + (this.step * i);
        }
    }

    get [Symbol.toStringTag]() {
        return `range(${this.start}, ${this.stop}, ${this.step})`;
    }
}

function normalizeSlice(start, stop, length) {
    if (start === undefined || start < -length) {
        start = 0;
    } else if (-length <= start && start < 0) {
        start = length + start;
    }

    if (stop < -length) {
        stop = 0;
    } else if (-length <= stop && stop < 0) {
        stop = length + stop;
    } else if (stop === undefined || stop >= length) {
        stop = length;
    }

    return [start, stop];
}

function getAt(target, prop) {
    const index = Number(prop);
    return 0 <= index && index < target.length ? target.at(index) : undefined;
}

function normalizeParams(start, stop, step) {
    if (stop === undefined && step === undefined) {
        return [0, start, 1];
    } else if (stop !== undefined && step === undefined) {
        return [start, stop, 1];
    } else {
        return [start, stop, step];
    }
}

function length(start, stop, step) {
    if ((step > 0 && stop < start) || (step < 0 && start < stop)) {
        return 0;
    } else {
        const absStep = Math.abs(step);
        const span = Math.abs(start - stop);
        return Math.floor((span + absStep - 1) / absStep);
    }
}

const arrayLike = {
    get(target, prop, receiver) {
        if (typeof prop === "string" && !isNaN(prop)) {
            return getAt(target, prop);
        } else {
            return Reflect.get(target, prop, receiver);
        }
    },
    set(target, p, newValue, receiver) {
        if (typeof p === "string" && !isNaN(p)) {
            return false;
        }
        return Reflect.set(target, p, newValue, receiver);
    },
};
