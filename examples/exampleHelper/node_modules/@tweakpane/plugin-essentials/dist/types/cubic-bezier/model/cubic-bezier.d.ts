import { PointNdAssembly } from '@tweakpane/core';
export declare type CubicBezierObject = [number, number, number, number];
export declare class CubicBezier {
    private readonly comps_;
    private cache_;
    constructor(x1?: number, y1?: number, x2?: number, y2?: number);
    get x1(): number;
    get y1(): number;
    get x2(): number;
    get y2(): number;
    static isObject(obj: any): obj is CubicBezierObject;
    static equals(v1: CubicBezier, v2: CubicBezier): boolean;
    curve(t: number): [number, number];
    y(x: number): number;
    toObject(): CubicBezierObject;
}
export declare const CubicBezierAssembly: PointNdAssembly<CubicBezier>;
