/* @ts-self-types="./types.d.ts" */

export function range(start, stop = null, step = null) {
    return new Range(start, stop, step);
}

export class Range {
    constructor(start, stop = null, step = null) {
        if (step === 0) {
            throw new Error("range step value cannot be 0");
        }

        if (stop === null && step === null) {
            [start, stop, step] = [0, start, 1];
        } else if (stop !== null && step === null) {
            step = 1;
        }
        Object.defineProperty(this, "start", {value: start});
        Object.defineProperty(this, "stop", {value: stop});
        Object.defineProperty(this, "step", {value: step});

        if ((step > 0 && stop < start) || (step < 0 && start < stop)) {
            Object.defineProperty(this, "length", {value: 0});
        } else {
            const absStep = Math.abs(step)
            const span = Math.abs(start - stop);
            const length = Math.floor((span + absStep - 1) / absStep);
            Object.defineProperty(this, "length", {value: length});
        }

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
     * Iterates over values in this range
     * @returns {Generator<number, void, void>}
     */
    * [Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this.start + (this.step * i);
        }
    }
}
