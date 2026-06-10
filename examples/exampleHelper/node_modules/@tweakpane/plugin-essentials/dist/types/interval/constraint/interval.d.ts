import { Constraint } from '@tweakpane/core';
import { Interval } from '../model/interval.js';
export declare class IntervalConstraint implements Constraint<Interval> {
    readonly edge: Constraint<number> | undefined;
    constructor(edge?: Constraint<number>);
    constrain(value: Interval): Interval;
}
