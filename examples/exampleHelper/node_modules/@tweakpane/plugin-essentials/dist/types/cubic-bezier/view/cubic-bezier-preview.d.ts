import { Value, View, ViewProps } from '@tweakpane/core';
import { CubicBezier } from '../model/cubic-bezier.js';
interface Config {
    value: Value<CubicBezier>;
    viewProps: ViewProps;
}
export declare class CubicBezierPreviewView implements View {
    readonly element: HTMLElement;
    private readonly svgElem_;
    private readonly ticksElem_;
    private readonly markerElem_;
    private readonly value_;
    private stopped_;
    private startTime_;
    constructor(doc: Document, config: Config);
    play(): void;
    stop(): void;
    private onDispose_;
    private updateMarker_;
    refresh(): void;
    private onTimer_;
    private onValueChange_;
}
export {};
