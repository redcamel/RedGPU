import { Value, View, ViewProps } from '@tweakpane/core';
import { CubicBezier } from '../model/cubic-bezier.js';
interface Config {
    selection: Value<number>;
    value: Value<CubicBezier>;
    viewProps: ViewProps;
}
export declare class CubicBezierGraphView implements View {
    readonly element: HTMLElement;
    previewElement: HTMLElement;
    private svgElem_;
    private guideElem_;
    private lineElem_;
    private handleElems_;
    private vectorElems_;
    private value_;
    private sel_;
    constructor(doc: Document, config: Config);
    private getVertMargin_;
    valueToPosition(x: number, y: number): {
        x: number;
        y: number;
    };
    positionToValue(x: number, y: number): {
        x: number;
        y: number;
    };
    refresh(): void;
    private onValueChange_;
}
export {};
