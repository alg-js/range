/* @ts-self-types="./types.d.ts" */

export function range(start, stop = null, step = null) {
    return new Range(start, stop, step);
}


export class Range {
    constructor(start, stop = null, step = null) {
        const target = Object.create(Range.prototype);
        if (step === 0) {
            throw new Error("range step value cannot be 0");
        }

        if (stop === null && step === null) {
            [start, stop, step] = [0, start, 1];
        } else if (stop !== null && step === null) {
            step = 1;
        }
        Object.defineProperty(target, "start", {value: start});
        Object.defineProperty(target, "stop", {value: stop});
        Object.defineProperty(target, "step", {value: step});

        if ((step > 0 && stop < start) || (step < 0 && start < stop)) {
            Object.defineProperty(target, "length", {value: 0});
        } else {
            const absStep = Math.abs(step);
            const span = Math.abs(start - stop);
            const length = Math.floor((span + absStep - 1) / absStep);
            Object.defineProperty(target, "length", {value: length});
        }

        return new Proxy(target, {
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
        });

    }

    /**
     * Retrieves the element at the given index of this range.
     * @param {number} index
     * @returns {number|undefined}
     */
    at(index) {
        if (index < -this.length || index >= this.length) {
            return undefined;
        } else if (index < 0) {
            return this.start + this.step * (index + this.length);
        } else {
            return this.start + this.step * index;
        }
    }

    /**
     * Returns a new range from slicing values in this range
     *
     * @param {number|null} start
     * @param {number|null} stop
     * @returns {Range}
     */
    slice(start = null, stop = null) {
        if (start === null || start < -this.length) {
            start = 0;
        } else if (-this.length <= start && start < 0) {
            start = this.length + start;
        }

        if (stop < -this.length) {
            stop = 0;
        } else if (-this.length <= stop && stop < 0) {
            stop = this.length + stop;
        } else if (stop === null || stop === undefined || stop >= this.length) {
            stop = this.length;
        }

        return range(
            this.start + (this.step * start),
            this.start + (this.step * stop),
            this.step,
        );
    }

    /**
     * Returns this range reversed.
     *
     * @returns {Range}
     */
    toReversed() {
        const newStart = this.start + this.step * (this.length - 1);
        const newStep = -this.step;
        const newStop = this.start + newStep;
        return new Range(newStart, newStop, newStep);
    }

    /**
     * Returns true if this range equals another range
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof Range
            && this.at(0) === other.at(0)
            && this.at(-1) === other.at(-1)
            && this.step === other.step;
    }

    /**
     * Returns a hash for the given range
     * @returns {number}
     */
    hash() {
        let result = 123;
        result = (this.at(0) ^ result) * 321;
        result = (this.at(-1) ^ result) * 321;
        result = (this.step ^ result) * 321;
        return result;
    }

    /**
     * Iterates over values in this range
     * @returns {Generator<number, void, void>}
     */
    * [Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this.start + (this.step * i);
        }
    }
}

function getAt(target, prop) {
    const index = Number(prop);
    if (0 <= index && index < target.length) {
        return target.at(index);
    } else {
        return undefined;
    }
}
