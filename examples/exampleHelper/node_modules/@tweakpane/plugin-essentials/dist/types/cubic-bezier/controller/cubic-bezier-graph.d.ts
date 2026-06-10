import { Value, ValueController, ViewProps } from '@tweakpane/core';
import { CubicBezier } from '../model/cubic-bezier.js';
import { CubicBezierGraphView } from '../view/cubic-bezier-graph.js';
interface Config {
    keyScale: Value<number>;
    value: Value<CubicBezier>;
    viewProps: ViewProps;
}
export declare class CubicBezierGraphController implements ValueController<CubicBezier, CubicBezierGraphView> {
    readonly value: Value<CubicBezier>;
    readonly view: CubicBezierGraphView;
    readonly viewProps: ViewProps;
    private readonly prevView_;
    private sel_;
    private keyScale_;
    constructor(doc: Document, config: Config);
    refresh(): void;
    private updateValue_;
    private onPointerDown_;
    private onPointerMove_;
    private onPointerUp_;
    private onKeyDown_;
    private onKeyUp_;
}
export {};
