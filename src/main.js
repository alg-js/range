/* @ts-self-types="./main.d.ts" */

export function range(start, stop = null, step = null) {
    return new Range(start, stop, step);
}

export class Range {
    constructor(start, stop = null, step = null) {
        if (step === 0) {
            throw new Error("range step value cannot be 0");
        }
        [start, stop, step] = normalizeParams(start, stop, step);
        const len = length(start, stop, step);
        Object.defineProperty(this, "start", { value: start });
        Object.defineProperty(this, "stop", { value: stop });
        Object.defineProperty(this, "step", { value: step });
        Object.defineProperty(this, "length", { value: len });
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

    toReversed() {
        const newStart = this.start + this.step * (this.length - 1);
        const newStep = -this.step;
        const newStop = this.start + newStep;
        return new Range(newStart, newStop, newStep);
    }

    equals(other) {
        return other instanceof Range &&
            this.at(0) === other.at(0) &&
            this.at(-1) === other.at(-1) &&
            this.step === other.step;
    }

    hash() {
        let result = 123;
        result = (this.at(0) ^ result) * 321;
        result = (this.at(-1) ^ result) * 321;
        result = (this.step ^ result) * 321;
        return result;
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this.start + (this.step * i);
        }
    }
}

function getAt(target, prop) {
    const index = Number(prop);
    return 0 <= index && index < target.length ? target.at(index) : undefined;
}

function normalizeParams(start, stop, step) {
    if (stop === null && step === null) {
        return [0, start, 1];
    } else if (stop !== null && step === null) {
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
