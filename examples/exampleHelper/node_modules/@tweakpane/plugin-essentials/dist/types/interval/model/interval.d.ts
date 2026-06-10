import { PointNdAssembly } from '@tweakpane/core';
export interface IntervalObject {
    max: number;
    min: number;
}
export declare class Interval {
    max: number;
    min: number;
    constructor(min: number, max: number);
    static isObject(obj: unknown): obj is IntervalObject;
    static equals(v1: Interval, v2: Interval): boolean;
    get length(): number;
    toObject(): IntervalObject;
}
export declare const IntervalAssembly: PointNdAssembly<Interval>;
